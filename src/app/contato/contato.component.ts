import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
import { ContatoService } from '../contato.service';
import { Contato } from './contato';


@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario!: FormGroup;
  contatos: Contato[] = [];

  colunas = ['foto', 'id', 'nome', 'email', 'favorito']

  constructor(
          private service: ContatoService,
          private fb: FormBuilder,
          private toast: ToastrService,
          private dialog: MatDialog
        ) { }

  ngOnInit(): void {
    this.listarContatos();
    this.montarFormulario();
  }

  submit() {
    const formValues = this.formulario.value;
    const contato : Contato = new Contato(formValues.nome, formValues.email);
    this.service.save(formValues).subscribe(resposta => {
      this.toast.success('Contato cadastrado com sucesso!');
      let lista: Contato[] = [...this.contatos, resposta];
      this.contatos = lista;
    })
  }

  favoritar(contato: Contato) {
    this.service.favorite(contato).subscribe(resposta => {
      contato.favorito = !contato.favorito;
    })
  }

  listarContatos() {
    this.service.list().subscribe(resposta => {
      this.contatos = resposta;
    })
  }

  montarFormulario() {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  uploadFoto(event: any, contato: Contato) {
    const files = event.target.files;
    if(files){
      const foto = files[0];
      const formData = new FormData();
      formData.append("foto", foto);
      this.service.upload(contato, formData).subscribe(resposta => this.listarContatos());
    }
  }

  visualizarContato(contato: Contato){
    this.dialog.open(ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data: contato
    })
  }

}
