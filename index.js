const fetch = require('node-fetch')
const fs = require('fs')

const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

const allRaces = {}
async function main() {
  await Promise.all(
    states.map(async state => {
      const formattedState = state.toLowerCase().replace(' ', '-')
    
      const json = await fetch(`https://static01.nyt.com/elections-assets/2020/data/api/2020-11-03/race-page/${formattedState}/president.json`).then(res => res.json())
      allRaces[state] = json.data.races[0]
    })
  )

  const csv = []
  states.forEach(state => {
    const race = allRaces[state]

    const timeseries = race.timeseries
    timeseries.forEach(row => {
      const timestamp = row.timestamp.replace('T', ' ').replace('Z', '').split('-').join('/')
      const rowData = [timestamp, state, row.votes, row.vote_shares.bidenj, row.vote_shares.trumpd, race.tot_exp_vote]
      csv.push(rowData.join(','))
    })
  })

  fs.writeFile('data.csv', csv.join('\n'), err => {
    if (err) console.error('file error', err)
    else console.log('successfully saved data')
  })
}
main()
