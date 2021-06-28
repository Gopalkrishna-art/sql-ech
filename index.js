const query = require('./connection.js')
const client = require('./database.js');
const arr = async () => {
    await client.connect();
    const matchesPlayedPerYear = `SELECT seasons.season,COUNT(seasons.season) as matchesPlayed
    FROM matchesfinal as matches
    JOIN seasontable as seasons
    ON matches.season_id = seasons.id
    GROUP BY seasons.season
        `
    const perTeam = await client.query(matchesPlayedPerYear).catch((err) => {
        console.log(err);
    });
    try {
        console.table(perTeam.rows);
    } catch (error) {
        console.log(error);
    }



    const matchesWonPerTeam = `SELECT seasons.season, teams.team1,COUNT(teams.team1)
    FROM matchesfinal as matches
    JOIN seasontable as seasons
    ON matches.season_id = seasons.id
    JOIN teamtable as teams
    ON matches.team1_id = teams.id
    GROUP BY seasons.season,teams.team1
    ORDER BY seasons.season
    `

    const teamsWon = await client.query(matchesWonPerTeam).catch((err) => {
        console.log(err);
    });
    try {
        console.table(teamsWon.rows);
    } catch (error) {
        console.log(error);
    }



    const extraRuns = `SELECT tm.team1 as team_team1,SUM(extra_runs) as extra_runs_in_2016
        FROM deliveriesfinal as df
            INNER JOIN teamtable as tm
                ON tm.id = df.batting_team
        WHERE match_id 
            IN (SELECT id FROM matchesfinal
                WHERE season_id
                    IN (SELECT id FROM seasonstable WHERE season = '2016')
                )
        GROUP BY tm.team1`
    const extraRunsIn2016 = await client.query(extraRuns).catch((err) => {
        console.log(err);
    });
    try {
        console.table(extraRunsIn2016.rows);
    } catch (error) {
        console.log(error);
    }



    const topBowlers = ` SELECT pt.bowler as player_name,SUM(total_runs::decimal)/(COUNT(total_runs::decimal)/6.0) as total_runs_in_2015
    FROM deliveriestable as dt
    INNER JOIN playertable as pt
    ON pt.id = dt.bowler_id
    WHERE match_id 
    IN (
    SELECT id 
    FROM matchefinal
    WHERE season_id
    IN (
    SELECT id 
    FROM seasonstable
    WHERE season = '2015')) 
    GROUP BY pt.bowler
    ORDER BY total_runs_in_2015
    LIMIT 10
`
    const topEconimicalBowlers = await client.query(topBowlers).catch((err) => {
        console.log(err);
    });
    try {
        console.table(topEconimicalBowlers.rows);
    } catch (error) {
        console.log(error);
    }



    client.end();
}
arr();