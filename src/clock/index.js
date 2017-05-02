import { Observable } from 'rxjs/Rx'

const clockElement = document.createElement('h1')
document.body.appendChild(clockElement)

Observable.interval(1000)
  .subscribe(time => {
	clockElement.textContent = time
})
