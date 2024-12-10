import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MatDialog } from '@angular/material/dialog';
import { ColaboradoresCursoComponent } from '../../../../../../helpers/components/modalView/colaboradores-curso/colaboradores-curso.component';
import { CoursesServices } from '../../../mantenimiento/mantenimiento-options/cursos/services/cursos.service';
import { PaginationI, ResponseI } from '../../../../../interfaces/generalInteerfaces';
import { CourseGetI, CourseI } from '../../../mantenimiento/mantenimiento-options/cursos/interfaces/cursos.interface';
import { InscribirListaComponent } from '../../modals/inscribir-lista/inscribir-lista.component';

@Component({
  selector: 'app-cursos-listado',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './cursos-listado.component.html',
  styleUrl: './cursos-listado.component.css'
})
export class CursosListadoComponent implements OnInit{
  cursoListfilter: Array<CourseGetI> = [];
  inputValue: string = '';
  page: number = 1
  pagination!: PaginationI
  isloading:boolean = true
  constructor(
    public dialog: MatDialog,
    public cursosService:CoursesServices
    ) {}

  ngOnInit(): void {
   this.getCursosfilter('');
  }
//Metodo para optener la lista de cursos
  getCursosfilter(valor:string){
    this.isloading = true;
    this.cursosService.getCoursesFilter(valor,this.page).subscribe((resp:ResponseI)=>{
      this.cursoListfilter = resp.data;
      const {currentPage ,totalItem, totalPage} = resp
      this.pagination = {currentPage ,totalItem, totalPage}
      this.isloading = false;
    })
  }
//llama el metodo de buscar curso y se dispara cuando el input cambia
  searchCourse(){
    this.getCursosfilter(this.inputValue)
  }

//Metodo que Abre el modal de los colaboradores que tiene un curso
  openModal(curso: CourseGetI): void {
    const dialogRef = this.dialog.open(ColaboradoresCursoComponent, {
      width: '900px',
      height: '620px',
      data: { curso }
    });

//metodo que se ejecuta cuando el modal cierra
    dialogRef.afterClosed().subscribe(result => {
      this.inputValue = ''
      this.getCursosfilter('');
    });
  }
//Metodo que Abre el modal de inscribir curso
  openModalIncribirLista(curso: CourseGetI): void {
    if (!curso.interno) {
      window.open(curso.link, '_blank');
    }else{
      const dialogRef = this.dialog.open(InscribirListaComponent, {
        width: '900px',
        data: { curso }
      });
//Metodo que se ejecuta cuando el modal cierre
      dialogRef.afterClosed().subscribe(result => {
        this.inputValue = ''
        this.getCursosfilter('');
      });
    }
  }

  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getCursosfilter(this.inputValue)
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
      ;this.getCursosfilter(this.inputValue)
    }
  }
}
