import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";

export const highlightedStateTrigger = trigger('highlightedState', [
    state('default', style({
      border: '2px solid #B2b6FF'
    })),
    state('highlighted', style({
      border: '4px solid #B2b6FF',
      filter: 'brightness(92%)'
    })),
    transition('default => highlighted', [
      animate('300ms 100ms ease-out', style({
        transform: 'scale(1.02)'
      })),
      animate(200)
    ])
])

export const shownStateTrigger = trigger('shownState', [
  transition(':enter', [
    style({
        opacity: 0
    }),
    animate('300ms', style({
        opacity: 1
    }))
  ]),
  transition(':leave', [
    animate('300ms', style({
        opacity: 0
    }))
  ])
])

export const checkButtonTrigger = trigger('checkButton', [
    transition('* => checked', [
        animate('400ms ease-in', style({
            transform: 'scale(0.4)'
        }))
    ])
])

export const filterTrigger = trigger('filterAnimation', [
    transition(':enter', [
        style({
            opacity: 0,
            width: 0
        }),
        animate('3000ms ease-out', keyframes([
            style({
                offset: 0.5,
                opacity: 0,
                width: 0
            }),
            style({
                offset: 0.8,
                opacity: 0.5,
                width: '*',
                backgroundColor: 'lightgreen'
            }),
            style({
                offset: 1,
                opacity: 1,
                width: '*',
                backgroundColor: 'lightblue'
            })
        ]))
    ]),
    transition(':leave', [
        animate('400ms 1.2s cubic-bezier(.15,.79,1,-0.01)', style({
            opacity: 0,
            width: 0
        }))
    ])
])