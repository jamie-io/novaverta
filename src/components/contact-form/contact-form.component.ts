import {Component, OnChanges} from '@angular/core';

@Component({
  selector: 'app-contact-form',
  imports: [],
  templateUrl: './contact-form.component.html',
  standalone: true,
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnChanges{

  sendMessage() {
    addEventListener("keyup", event => {
      event.preventDefault()
    })
  }

  ngOnChanges(){
    const userName = document.getElementById("nameInput")?.innerText
    const email = document.getElementById("emailInput")?.innerText
    const mailContent = document.getElementById("emailContent")?.innerText
    const message = `Name: ${userName} | Email: ${email} | Content: ${mailContent}`;
    console.log(message)

  }
}
