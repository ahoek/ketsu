import {HiraganaColumnHelper} from './hiragana-column-helper';
declare var wanakana: any;
/**
 * This class helps in conjungating verbs
 */
export class Verb {

    public word: String;
    public reading: String;
    public partOfSpeech: String;
    public englishDefinition: String;
    
    private endChar: String;
    private secondCharToEnd: String;
    private withoutEnd: String;

    //private GROUP_ONE_EXCEPTIONS = ["はいる", "はしる", "かえる", "かぎる", "きる", "しゃべる", "しる"];
    //private GROUP_THREE = ["くる", "する"];
    //private GROUP_FOUR = [["いる", "ある"], ["です"]]
    public static verbPartOfSpeech = [
        "Godan verb with u ending",
        "Godan verb with tsu ending",
        "Godan verb with ru ending",
        "Godan verb - Iku/Yuku special class",
        "Godan verb with ku ending",
        "Godan verb with gu ending",
        "Godan verb with bu ending",
        "Godan verb with mu ending",
        "Godan verb with nu ending",
        "Godan verb with su ending",
        "Ichidan verb",
        "Suru verb",
        "Kuru verb - special class",
        "Suru verb - irregular",        
    ];
    
    /**
     * Create a verb from a Jisho api-like object
     */
    constructor(public definition: any) {
        this.word = definition.japanese[0].word;
        this.reading = wanakana.toHiragana(definition.japanese[0].reading);
        
        // @todo CHeck all senses for part of speech and only allow verbs
        definition.senses.forEach((sense: any) => {
            
            if (sense.parts_of_speech.length > 0) {
                //console.log(sense.parts_of_speech)
                sense.parts_of_speech.forEach((partOfSpeech: string) => {
                    if (Verb.verbPartOfSpeech.indexOf(partOfSpeech) !== -1) {
                        this.englishDefinition = sense.english_definitions[0];
                        this.partOfSpeech = partOfSpeech;
                        //console.log('yeah', partOfSpeech);
                    }
                });
            }
        });


        // Suru verb
        if (this.partOfSpeech == 'Suru verb') {
            this.word = this.reading + 'する';
            this.reading = this.reading + 'する';
        }

        // Find slices
        this.endChar = this.reading.slice(-1);
        this.secondCharToEnd = this.reading.slice(-2, -1);
        this.withoutEnd = this.reading.slice(0, -1);
    }

    /**
     * Get the verb group (1, 2 or 3)
     */
    group() {
        var group: String;
        
        switch (this.partOfSpeech) {
            case "Godan verb with u ending":
            case "Godan verb with tsu ending":
            case "Godan verb with ru ending":
            case "Godan verb - Iku/Yuku special class":
            case "Godan verb with ku ending":
            case "Godan verb with gu ending":
            case "Godan verb with bu ending":
            case "Godan verb with mu ending":
            case "Godan verb with nu ending":
            case "Godan verb with su ending":
                group = "1"
                break;            
            case "Ichidan verb":
                group = "2"
                break;
            case "Suru verb":
            case "Kuru verb - special class":
            case "Suru verb - irregular":
                group = "3"
                break;
            default:
                // Not a verb
                break;
        }
        
        return group;
    }

    masuStem() {
        var stem: String;
        if (this.group() === "1") {
            let preMasu = HiraganaColumnHelper.change(this.endChar, "U", "I");
            stem = this.withoutEnd + preMasu;
        }
        
        if (this.group() === "2") {
            stem = this.withoutEnd;
        }

        if (this.group() === "3") {
            if (this.partOfSpeech != 'Suru verb') {
                stem = HiraganaColumnHelper.change(this.withoutEnd, "U", "I");
            } else {
                stem = this.reading.slice(0, -2) + HiraganaColumnHelper.change(this.secondCharToEnd, "U", "I");
            }
        }
        
        return stem;
    }

    getTeForm() {
        var teForm;
        let stem = this.withoutEnd;      
        var ending;
        switch (this.partOfSpeech) {
            case "Ichidan verb":
                ending = 'て'
                break;
            case "Godan verb with u ending":
            case "Godan verb with tsu ending":
            case "Godan verb with ru ending":
            case "Godan verb - Iku/Yuku special class":
                ending = 'って';
                break;
            case "Godan verb with ku ending":
                ending = 'いて';
                break;
            case "Godan verb with gu ending":
                ending = 'いで';
                break;
            case "Godan verb with bu ending":
            case "Godan verb with mu ending":
            case "Godan verb with nu ending":
                ending = 'んで';
                break;
            case "Godan verb with su ending":
            case "Suru verb":
            case "Kuru verb - special class":
            case "Suru verb - irregular":
                stem = this.masuStem();
                ending = 'て';
                break;
        }

        teForm = stem + ending;
        console.log(this.partOfSpeech, this.reading, this.withoutEnd, stem, teForm)
        return teForm;
    }
}
