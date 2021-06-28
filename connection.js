const client = require('./database.js');
const fetchData = require('./ipl/fetchdata.js');
const {matchesFilePath, deliveriesFilePath} = require('./ipl/constants.js');

const query = async () => {
    const [matches, deliveries] = await fetchData(matchesFilePath, deliveriesFilePath);
    console.log(matches[0], deliveries[0]);
    await client.connect();




    await client.query('DROP TABLE IF EXISTS seasontable, citytable,teamtable,umpiretable,matchestable,matchesfinal')

    let seasonTable = `CREATE TABLE IF NOT EXISTS seasontable(                                                  
    id serial PRIMARY KEY,
    season VARCHAR(6));
    `
    await client.query(seasonTable)
    let yearsArray = [];
    for (let match of matches) {
        if (!yearsArray.includes(match.season)) {
            yearsArray.push(match.season);
            await client.query(`INSERT INTO seasontable (season) VALUES($1)`, [match.season]);
        }
    }

    let cityTable = `CREATE TABLE IF NOT EXISTS citytable(                                                  
    id serial PRIMARY KEY,
    city VARCHAR(60));
    `
    await client.query(cityTable)
    let cityArray = [];
    for (let match of matches) {
        if (!cityArray.includes(match.city)) {
            cityArray.push(match.city);
            await client.query(`INSERT INTO citytable (city) VALUES($1)`, [match.city]);
        }
    }

    let teamTable = `CREATE TABLE IF NOT EXISTS teamtable(                                                  
    id serial PRIMARY KEY,
    team1 VARCHAR(60));
    `
    await client.query(teamTable)
    let teamArray = [];
    for (let match of matches) {
        if (!teamArray.includes(match.team1)) {
            teamArray.push(match.team1);
            await client.query(`INSERT INTO teamtable (team1) VALUES($1)`, [match.team1]);
        }
    }
    let umpireTable = `CREATE TABLE IF NOT EXISTS umpiretable(                                                  
    id serial PRIMARY KEY,
    umpire1 VARCHAR(60));
    `
    await client.query(umpireTable)
    let umpireArray = [];
    for (let match of matches) {
        if (!umpireArray.includes(match.umpire1)) {
            umpireArray.push(match.umpire1);
            await client.query(`INSERT INTO umpiretable (umpire1) VALUES($1)`, [match.umpire1]);
        }
    }

    let player = `create table if not exists playertable(                                                  
        id serial primary key,
        player_of_match varchar(60));
        `
        client.query(player)
    const playerArray=[];
    for(let match of matches){
        if(!playerArray.includes(match.player_of_match)){
            playerArray.push(match.player_of_match);
            await client.query(`insert into playertable (player_of_match) values($1)`,[match.player_of_match]);
        }
    }


    let matchesTable = `CREATE TABLE IF NOT EXISTS matchestable(                                                  
        id int PRIMARY KEY,
            season VARCHAR(4),
            city VARCHAR(100),
            date date,
            team1 VARCHAR(50),
            team2 VARCHAR(50),
            toss_winner VARCHAR(50),
            toss_decision VARCHAR(20),
            result VARCHAR(20),
            dl_applied VARCHAR(3),
            winner VARCHAR(50),
            win_by_runs VARCHAR(4),
            win_by_wickets VARCHAR(2),
            player_of_match VARCHAR(80),
            venue VARCHAR(100),
            umpire1 VARCHAR(50),
            umpire2 VARCHAR(50),
            umpire3 VARCHAR(50));
        `
    await client.query(matchesTable)
    for (match of matches) {
        await client.query(`INSERT INTO matchestable VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
                    )`, [match.id, match.season, match.city, match.date, match.team1, match.team2, match.toss_winner, match.toss_decision, match.result,
            match.dl_applied, match.winner, match.win_by_runs, match.win_by_wickets, match.player_of_match, match.venue,
            match.umpire1, match.umpire2, match.umpire3
        ])
    }

    await client.query(` UPDATE matchestable set season = (SELECT id FROM seasontable WHERE matchestable.season = seasontable.season);`);
    await client.query(` UPDATE matchestable set city = (SELECT id FROM citytable WHERE matchestable.city = citytable.city);`);
    await client.query(` UPDATE matchestable set team1 = (SELECT id FROM teamtable WHERE matchestable.team1 = teamtable.team1);`);
    await client.query(` UPDATE matchestable set umpire1 = (SELECT id FROM umpiretable WHERE matchestable.umpire1 = umpiretable.umpire1);`);
    await client.query(` UPDATE matchestable set player_of_match= (SELECT id FROM playertable WHERE matchestable.player_of_match = playertable.player_of_match);`);
    
    
    

    let matchesFinal = `CREATE TABLE IF NOT EXISTS matchesfinal(                                                  
        id int PRIMARY KEY,
        season_id int,
        city_id int,
        date date,
        team1_id int,
        team2 VARCHAR(50),
        toss_winner VARCHAR(50),
        toss_decision VARCHAR(20),
        result VARCHAR(20),
        dl_applied VARCHAR(3),
        winner VARCHAR(50),
        win_by_runs VARCHAR(4),
        win_by_wickets VARCHAR(2),
        player_of_match_id int,
        venue VARCHAR(100),
        umpire1_id int,
        umpire2 VARCHAR(50),
        umpire3 VARCHAR(50),

        FOREIGN KEY (season_id) REFERENCES seasontable (id),
        FOREIGN KEY (city_id) REFERENCES citytable (id),
        FOREIGN KEY (team1_id) REFERENCES teamtable (id),
        FOREIGN KEY (umpire1_id) REFERENCES umpiretable (id)
        FOREIGN KEY (player_of_match_id) REFERENCES playertable (id));
        `

        await client.query(matchesFinal)
       await client.query(`INSERT INTO matchesfinal
       SELECT id,
       season::int,
       city::int,
       date ,
       team1::int,
       team2 ,
       toss_winner,
       toss_decision ,
       result ,
       dl_applied ,
       winner ,
       win_by_runs ,
       win_by_wickets ,
       player_of_match ,
       venue ,
       umpire1::int,
       umpire2 ,
       umpire3 
        FROM matchestable;
       `)

 

    await client.query('DROP TABLE IF EXISTS batmantable, bowlertable,nonstrikertable,playerdistable,deliveriestable,matchesfinal')

    let batmanTable = `CREATE TABLE IF NOT EXISTS batmantable(                                                  
                                        id serial PRIMARY KEY,
                                    batsman VARCHAR(50));`
    await client.query(batmanTable)
    let batmanArray = [];
    for (let delivery of deliveries) {
        if (!batmanArray.includes(delivery.batsman)) {
            batmanArray.push(delivery.batsman);
            await client.query(`INSERT INTO batmantable (batsman) VALUES($1)`, [delivery.batsman]);
        }

    }

    let bowlerTable = `CREATE TABLE IF NOT EXISTS bowlertable(                                                  
                id serial PRIMARY KEY,
            bowler VARCHAR(50));`
    await client.query(bowlerTable)
    let bowlerArray = [];
    for (let delivery of deliveries) {
        if (!bowlerArray.includes(delivery.bowler)) {
            bowlerArray.push(delivery.bowler);
            await client.query(`INSERT INTO bowlertable (bowler) VALUES($1)`, [delivery.bowler]);
        }
    }


    let nonstrikerTable = `CREATE TABLE IF NOT EXISTS nonstrikertable(                                                  
    id serial PRIMARY KEY,
    non_striker VARCHAR(50));`
    await client.query(nonstrikerTable)
    let strikeArray = [];
    for (let delivery of deliveries) {
        if (!strikeArray.includes(delivery.non_striker)) {
            strikeArray.push(delivery.non_striker);
            await client.query(`INSERT INTO nonstrikertable (non_striker) VALUES($1)`, [delivery.non_striker]);
        }
    }

    let playerdisTable = `CREATE TABLE IF NOT EXISTS playerdistable(                                                  
    id serial PRIMARY KEY,
    player_dismissed VARCHAR(50));`
    await client.query(playerdisTable)
    let dismissArray = [];
    for (let delivery of deliveries) {
        if (!dismissArray.includes(delivery.player_dismissed)) {
            dismissArray.push(delivery.player_dismissed);
            await client.query(`INSERT INTO playerdistable (player_dismissed) VALUES($1)`, [delivery.player_dismissed]);
        }

    }
    let deliveriesTable = `CREATE TABLE IF NOT EXISTS deliveriestable (
        match_id varchar(5) not null,
        inning varchar(2) ,
        batting_team varchar(50),
        bowling_team varchar(50),
        over varchar(3),
        ball varchar(4),
        batsman varchar(50),
        non_stricker varchar(50),
        bowler varchar(50),
        is_super_over varchar(2),
        wide_runs varchar(2),
        bye_runs varchar(2),
        legbye_runs varchar(2),
        noball_runs varchar(2),
        penalty_runs varchar(2),
        batsman_runs varchar(2),
        extra_runs varchar(2),
        total_runs varchar(4),
        player_dismissed varchar(50),
        dismissal_kind varchar(20),
        fielder varchar(50));
        `
    client.query(deliveriesTable, (err) => {
        if (!err) {
            console.log('deliveriestable created');
        }
    })

    for (match of deliveries) {

        await client.query(`insert into deliveriestable values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,
                    $14,$15,$16,$17,$18,$19,$20,$21
                    )`, [match.match_id, match.inning, match.batting_team, match.bowling_team, match.over, match.ball, match.batsman,
            match.non_stricker, match.bowler,
            match.is_super_over, match.wide_runs, match.bye_runs, match.legbye_runs, match.noball_runs,
            match.penalty_runs, match.batsman_runs, match.extra_runs, match.total_runs, match.player_dismissed,
            match.dismissal_kind, match.fielder
        ])
    }

    await client.query(` UPDATE deliveriestable set batsman = (SELECT id FROM batmantable WHERE deliveriestable.batsman = batmantable.batsman);`);
    await client.query(` UPDATE deliveriestable set bowler = (SELECT id FROM citytable WHERE deliveriestable.bowler = bowlertable.city);`);
    await client.query(` UPDATE deliveriestable set team1 = (SELECT id FROM teamtable WHERE deliveriestable.non_striker = nonstrikertable.team1);`);
    await client.query(` UPDATE deliveriestable set umpire1 = (SELECT id FROM umpiretable WHERE deliveriestable.player_dismissed = playerdistable.umpire1);`);


    let deliveriesFinal = `CREATE TABLE IF NOT EXISTS deliveriesfinal (
        match_id int not null,
        inning varchar(2) ,
        batting_team_id int,
        bowling_team_id int,
        over varchar(3),
        ball varchar(4),
        batsman_id int,
        non_stricker_id int,
        bowler_id int,
        is_super_over varchar(2),
        wide_runs varchar(2),
        bye_runs varchar(2),
        legbye_runs varchar(2),
        noball_runs varchar(2),
        penalty_runs varchar(2),
        batsman_runs varchar(2),
        extra_runs varchar(2),
        total_runs varchar(4),
        player_dismissed_id int,
        dismissal_kind varchar(20),
        fielder varchar(50),

        FOREIGN KEY (batsman_id) REFERENCES playertable (id),
        FOREIGN KEY (bowler_id) REFERENCES bowlertable (id),
         FOREIGN KEY (batting_team_id) REFERENCES teamtable (id),
         FOREIGN KEY (bowling_team_id) REFERENCES teamtable (id),
        FOREIGN KEY (non_stricker_id) REFERENCES nonstrikertable (id),
        FOREIGN KEY (match_id) REFERENCES matchesfinal (id),
        FOREIGN KEY (player_dismissed_id) REFERENCES playerdistable (id));
        `

    await client.query(deliveriesFinal)

    await client.query(`INSERT INTO deliveriesfinal
        match_id ,
        inning ,
        batting_team::int,
        bowling_team,
        over,
        ball,
        batsman::int,
        non_stricker::int,
        bowler::int,
        is_super_over,
        wide_runs,
        bye_runs,
        legbye_runs,
        noball_runs,
        penalty_runs,
        batsman_runs,
        extra_runs,
        total_runs,
        player_dismissed::int,
        dismissal_kind,
        fielder  
        FROM deliveriestable;
        `)



    client.end();
}
// query();
module.exports={query}