import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Verb} from '../models/verb';
import {Question} from '../models/question';
import {Settings} from '../models/settings';

/**
 * QuestionData provider.
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
        return new Promise<Question[]>(resolve => {
            const url = 'assets/data/questions/words-' + settings.jlptLevel + '.json';
            const options = this.getQuestionTypeOptions(settings);
            console.log('question types', options);

            this.http.get(url).map(res => res.json()).subscribe(dictionary => {
                resolve(this.getQuestionsFromDictionary(dictionary, settings, options));
            });
        });
    }
    
    getQuestionsFromDictionary(dictionary: any, settings: Settings, options: string[]): Question[] {
        const numberOfQuestions = 10;
        let questions: Question[] = [];

        if (options.length == 0) {        
            return questions;
        }
        
        while (questions.length < numberOfQuestions) {
            let questionType: string = this.getRandomItem(options, false);
            
            let question = this.getQuestion(dictionary, settings, questionType);
            if (question) {
                questions.push(question);
            }
        }
        return questions;
    }
    
    /**
     * Create a question from the dictionary
     */
    getQuestion(dictionary: any, settings: Settings, type: string): Question {
        if (!type) {
            return;
        }
        let word: JishoDefinition;
        if (type.startsWith('i-adjective')) {
            word = this.getRandomItem(dictionary['adj-i']);
        } else if (type.startsWith('na-adjective')) {
            word = this.getRandomItem(dictionary['adj-na']);
        } else {
            word = this.getRandomItem(dictionary['verb']);
        }

        if (!word) {
            return;
        }

        let verb = new Verb(word);
        if (!verb.word) {
            return;
        }
        
        if (settings.leaveOutSuru && verb.isSuru()) {
            return;
        }

        let question = Question.createFromVerbWithType(verb, type);
        if (!question.isValid()) {
            return;
        }

        if (settings.reverse === true) {
            question = question.reverse();
        }

        console.log('answers', question.answers);
        return question;
    }

    /** 
     * Set the available question options
     */
    getQuestionTypeOptions(settings: Settings): string[] {
        let options: string[] = [];
        if (settings.normal) {
            this.addOptionsFor('', settings, options);
        }

        if (settings.volitional) {
            if (settings.plain) {
                options.push('volitional-plain');
            }
            if (settings.polite) {
                options.push('volitional-polite');
            }
        }
        
        if (settings.potential) {
            if (settings.plain) {
                options.push('potential-plain');
            }
            if (settings.polite) {
                options.push('potential-polite');
            }
        }

        if (settings.taiForm) {
            this.addSubOptionsFor('tai-form', settings, options);
        }

        if (settings.iAdjective) {
            this.addOptionsFor('i-adjective-', settings, options);
        }

        if (settings.naAdjective) {
            this.addOptionsFor('na-adjective-', settings, options);
        }
        
        return options;
    }
    
    /**
     * Add options for te-form, plain and polite
     */
    addOptionsFor(base: string, settings: Settings, options: string[]) {
        if (settings.teForm) {
            options.push(base + 'te-form'); 
        }

        if (settings.plain) {
            this.addSubOptionsFor(base + 'plain', settings, options);
        }
        if (settings.polite) {
            this.addSubOptionsFor(base + 'polite', settings, options);
        }
    }
    
    /**
     * Add past/nonpast and positive/negative options
     */
    addSubOptionsFor(base: string, settings: Settings, options: string[]) {
        if (settings.nonPast) {
            if (settings.positive) {
                options.push(base + '-positive-present');
            }
            if (settings.negative) {
                options.push(base + '-negative-present');
            }
        }
        if (settings.past) {
            if (settings.positive) {
                options.push(base + '-positive-past');
            }
            if (settings.negative) {
                options.push(base + '-negative-past');
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
