import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TarefaService } from 'src/app/service/tarefa.service';
import { Tarefa } from '../interface/tarefa';
import { checkButtonTrigger, filterTrigger, formButtonTrigger, highlightedStateTrigger, listStateTrigger, messageTrigger, shakeTrigger, shownStateTrigger } from '../animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.css'],
  animations: [
    highlightedStateTrigger, 
    shownStateTrigger, 
    checkButtonTrigger,
    filterTrigger,
    formButtonTrigger,
    messageTrigger,
    shakeTrigger,
    listStateTrigger
  ]
})
export class ListaTarefasComponent implements OnInit {
  listaTarefas: Tarefa[] = [];
  formAberto: boolean = false;
  categoria: string = '';
  validado: boolean = false;
  indexTarefa: number = -1;
  id: number = 0;
  campoBusca: string = '';
  tarefasFiltradas: Tarefa[] = [];
  tarefasSubscrition: Subscription = new Subscription();
  estadoBotao: string = 'unchecked'

  formulario: FormGroup = this.fomBuilder.group({
    id: [0],
    descricao: ['', Validators.required],
    statusFinalizado: [false, Validators.required],
    categoria: ['', Validators.required],
    prioridade: ['', Validators.required],
  });

  constructor(
    private service: TarefaService,
    private fomBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.service.listar();
    this.tarefasSubscrition = this.service.tarefas$.subscribe(x => {
      this.listaTarefas = x;
      this.tarefasFiltradas = x;
    })
  }

  filtrarTarefasPorDescricao(descricao: string){
    this.campoBusca = descricao.trim().toLocaleLowerCase();
    if (descricao) {
      this.tarefasFiltradas = this.listaTarefas.filter(x => x.descricao.toLocaleLowerCase().includes(this.campoBusca));
    } else {
      this.tarefasFiltradas = this.listaTarefas;
    }
  }

  mostrarOuEsconderFormulario() {
    this.formAberto = !this.formAberto;
    this.resetarFormulario();
  }

  salvarTarefa() {
    if (this.formulario.value.id) {
      this.editarTarefa();
    } else {
      this.criarTarefa();
    }
  }

  editarTarefa() {
    if (this.formulario.valid) {
      const tarefaEditada = this.formulario.value;
      this.service.editar(tarefaEditada, true);
      this.resetarFormulario();
    }
  }

  criarTarefa() {
    if (this.formulario.valid) {
      const novaTarefa = this.formulario.value;
      this.service.criar(novaTarefa);
      this.resetarFormulario();
    }
  }

  excluirTarefa(tarefa: Tarefa) {
    if (tarefa.id) {
      this.service.excluir(tarefa.id)
    }
  }

  cancelar() {
    this.resetarFormulario();
    this.formAberto = false;
  }

  resetarFormulario() {
    this.formulario.reset({
      descricao: '',
      statusFinalizado: false,
      categoria: '',
      prioridade: '',
    });
  }

  carregarParaEditar(id: number) {
    this.service.buscarPorId(id!).subscribe((tarefa) => {
      this.formulario = this.fomBuilder.group({
        id: [tarefa.id],
        descricao: [tarefa.descricao],
        categoria: [tarefa.categoria],
        statusFinalizado: [tarefa.statusFinalizado],
        prioridade: [tarefa.prioridade],
      });
    });
    this.formAberto = true;
  }

  finalizarTarefa(tarefa: Tarefa) {
    this.id = tarefa.id;
    this.service.atualizarStatusTarefa(tarefa);

    if(tarefa.statusFinalizado == true) {
      this.estadoBotao = 'checked'
    } else {
      this.estadoBotao = 'unchecked'
    }
  }

  habilitarBotao(): string {
    if (this.formulario.valid) {
      return 'botao-salvar';
    } else return 'botao-desabilitado';
  }

  campoValidado(campoAtual: string): string {
    if (
      this.formulario.get(campoAtual)?.errors &&
      this.formulario.get(campoAtual)?.touched
    ) {
      this.validado = false;
      return 'form-tarefa input-invalido';
    } else {
      this.validado = true;
      return 'form-tarefa';
    }
  }
}
