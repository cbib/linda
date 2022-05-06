import { Component, OnInit, NgZone } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserInterface } from 'src/app/models/linda/person';
import { User } from '../../models/user';
declare const annyang: any;
@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
	voiceActiveSectionDisabled: boolean = true;
	voiceActiveSectionError: boolean = false;
	voiceActiveSectionSuccess: boolean = false;
	voiceActiveSectionListening: boolean = false;
	voiceText: any;
	users: UserInterface[] = [];
	constructor(private ngZone: NgZone) { }

	ngOnInit() { }

	initializeVoiceRecognitionCallback(): void {
		annyang.addCallback('error', (err) => {
			if (err.error === 'network') {
				this.voiceText = "Internet is require";
				annyang.abort();
				this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
			} else if (this.voiceText === undefined) {
				this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('soundstart', (res) => {
			this.ngZone.run(() => this.voiceActiveSectionListening = true);
		});

		annyang.addCallback('end', () => {
			if (this.voiceText === undefined) {
				this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('result', (userSaid) => {
			this.ngZone.run(() => this.voiceActiveSectionError = false);
			alert("I think the user said: " + userSaid[0] + "<br> But then again, it could be any of the following: " + userSaid);
			let queryText: any = userSaid[0];

			annyang.abort();

			this.voiceText = queryText;
			console.log(queryText)
			this.ngZone.run(() => this.voiceActiveSectionListening = false);
			this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
		});
	}

	startVoiceRecognition(): void {
		this.voiceActiveSectionDisabled = false;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
		this.voiceText = undefined;

		if (annyang) {
			console.log(this.voiceText)
			//			let commands = {
			//				'demo-annyang': () => { },
			//        'hello-world' : () => { console.log("hello world")}
			//			}

			const commands = {
				'hello': () => { alert('Hello world!'); }

			};
			annyang.addCommands(commands);

			this.initializeVoiceRecognitionCallback();

			annyang.start({ autoRestart: false, continuous: false });
		}
	}

	closeVoiceRecognition(): void {
		this.voiceActiveSectionDisabled = true;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
		this.voiceActiveSectionListening = false;

		this.voiceText = undefined;

		if (annyang) {
			annyang.abort();
		}
	}
	//    private loadAllUsers() {
	//        this.userService.getAll().pipe(first()).subscribe(users => { 
	//            this.users = users; 
	//        });
	//    }
	//    deleteUser(id: string) {
	//        this.userService.delete(id).pipe(first()).subscribe(() => { 
	//            this.loadAllUsers() 
	//        });
	//    }

}
