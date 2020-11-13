import schedule from 'node-schedule';
import cancelTransaction from './jobs-cancel-transaction';

const jobs = [].concat(
  cancelTransaction
)

function init (app){
  app.jobs = [];
  jobs.forEach(job => {
    app.jobs.push({
      name: job.name,
      job: schedule.scheduleJob(job.time, job.callback)
    })
  })
}

export default init 