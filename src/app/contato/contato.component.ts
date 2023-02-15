import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../contato.service';
import { Contato } from './contato';


@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  constructor(private service: ContatoService) { }

  ngOnInit(): void {

    const c : Contato = new Contato();
    c.nome = 'Eduardo';
    c.email = 'eduardo@mail.com';
    c.favorito = true;

    this.service.save(c).subscribe(resposta => {
      console.log(resposta)
    })
  }

}
