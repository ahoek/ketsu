import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Verb} from '../models/verb';
import {Question} from '../models/question';
import {Settings} from '../models/settings';

/**
 *  QuestionData provider.
 */
@Injectable()
export class QuestionData {
    constructor(public http: Http) {

    }

    /**
     * Provider of question data
     * 
     * Settings to create the answers
     */
    load(settings: Settings) {
        return new Promise(resolve => {
            this.http.get('assets/data/questions/words-' + settings.jlptLevel + '.json').map(res => res.json()).subscribe(dictionary => {
                let allVerbs: Array<any> = dictionary.verb;
                let allIAdjectives: Array<any> = dictionary['adj-i'];
                let allNaAdjectives: Array<any> = dictionary['adj-na'];
                let questions: Array<Question> = [];
                let word: any;

                const numberOfQuestions = 10;

                for (let i = 0; i < numberOfQuestions; i++) {
                    let type: string = this.getRandomItem(this.questionTypeOptions(settings), false);
                    if (type.startsWith('i-adjective')) {
                        word = this.getRandomItem(allIAdjectives);
                    } else if (type.startsWith('na-adjective')) {
                        word = this.getRandomItem(allNaAdjectives);
                    } else {
                        word = this.getRandomItem(allVerbs);
                        //console.log('get verb', word);
                    }
                    
                    if (!word) {
                        break;
                    }

                    let verb = new Verb(word);
                    if (!verb.word) {
                        i--;
                        continue;
                    }
                    if (settings.leaveOutSuru && verb.isSuru()) {
                        i--;
                        continue;
                    }

                    let question = Question.createFromVerbWithType(verb, type);

                    if (!question.isValid()) {
                        i--;
                        continue;
                    }
                    console.log('answers', question.answers);
                    questions.push(question);
                }
                resolve(questions);
            });
        });
    }

    questionTypeOptions(settings: Settings): Array<string> {
        // Find the available question options
        const options = [];

        if (settings['teForm'] === true) {
            options.push('te-form');
        }

        if (settings.normal === true) {
            if (settings.plain === true) {
                if (settings.nonPast === true) {
                    if (settings.positive === true) {
                        options.push('plain-positive-present');
                    }
                    if (settings.negative === true) {
                        options.push('plain-negative-present');
                    }
                }
                if (settings.past === true) {
                    if (settings.positive === true) {
                        options.push('plain-positive-past');
                    }
                    if (settings.negative === true) {
                        options.push('plain-negative-past');
                    }
                }
            }
            if (settings.polite === true) {
                if (settings.nonPast === true) {
                    if (settings.positive === true) {
                        options.push('polite-positive-present');
                    }
                    if (settings.negative === true) {
                        options.push('polite-negative-present');
                    }
                }
                if (settings.past === true) {
                    if (settings.positive === true) {
                        options.push('polite-positive-past');
                    }
                    if (settings.negative === true) {
                        options.push('polite-negative-past');
                    }
                }
            }
        }

        if (settings.volitional === true) {
            if (settings.polite === true) {
                options.push('volitional-polite');
            }
        }

        if (settings.taiForm === true) {
            if (settings.nonPast === true) {
                if (settings.positive === true) {
                    options.push('tai-form-positive-present');
                }
                if (settings.negative === true) {
                    options.push('tai-form-negative-present');
                }
            }
            if (settings.past === true) {
                if (settings.positive === true) {
                    options.push('tai-form-positive-past');
                }
                if (settings.negative === true) {
                    options.push('tai-form-negative-past');
                }
            }
        }

        if (settings.iAdjective === true) {
            if (settings.plain === true) {
                if (settings.nonPast === true) {
                    if (settings.positive === true) {
                        options.push('i-adjective-plain-positive-present');
                    }
                    if (settings.negative === true) {
                        options.push('i-adjective-plain-negative-present');
                    }
                }
                if (settings.past === true) {
                    if (settings.positive === true) {
                        options.push('i-adjective-plain-positive-past');
                    }
                    if (settings.negative === true) {
                        options.push('i-adjective-plain-negative-past');
                    }
                }
            }
            if (settings.polite === true) {
                if (settings.nonPast === true) {
                    if (settings.positive === true) {
                        options.push('i-adjective-polite-positive-present');
                    }
                    if (settings.negative === true) {
                        options.push('i-adjective-polite-negative-present');
                    }
                }
                if (settings.past === true) {
                    if (settings.positive === true) {
                        options.push('i-adjective-polite-positive-past');
                    }
                    if (settings.negative === true) {
                        options.push('i-adjective-polite-negative-past');
                    }
                }
            }
        }

        return options;
    }

    /**
     * Get a random item from an array and remove it from the array
     */
    getRandomItem(items: Array<any>, removeItem: boolean = true) {
        const randomIndex = Math.floor(Math.random() * items.length);
        if (removeItem === true) {
            let item = items.splice(randomIndex, 1);
            return item[0];
        } else {
            return items[randomIndex];
        }
    }
}
