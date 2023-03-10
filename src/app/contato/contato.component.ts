import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  totalElementos = 0;
  pagina = 0;
  tamanho = 10;
  pageSizeOptions: number[] = [10];

  constructor(
          private service: ContatoService,
          private fb: FormBuilder,
          private dialog: MatDialog,
          private snack: MatSnackBar
        ) { }

  ngOnInit(): void {
    this.listarContatos(this.pagina, this.tamanho);
    this.montarFormulario();
  }

  submit() {
    const formValues = this.formulario.value;
    const contato : Contato = new Contato(formValues.nome, formValues.email);
    this.service.save(formValues).subscribe(resposta => {
      this.listarContatos();
      this.snack.open('Contato cadastrado com sucesso!', 'OK', {
        duration: 2000
      });
      this.formulario.reset();
    })
  }

  favoritar(contato: Contato) {
    this.service.favorite(contato).subscribe(resposta => {
      contato.favorito = !contato.favorito;
    })
  }

  listarContatos(pagina = 0, tamanho = 10) {
    this.service.list(pagina, tamanho).subscribe(resposta => {
      this.contatos = resposta.content!;
      this.totalElementos = resposta.totalElements!;
      this.pagina = resposta.number!;
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

  paginar(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.listarContatos(this.pagina, this.tamanho);
  }

}
