import { Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EvalucionCompetenciasComponent } from './components/layout/components/evaluacion-competencias/pages/competencias/evalucion-competencias.component';
import { MantenimientoComponent } from './components/layout/components/mantenimiento/mantenimiento.component';
import { PeriodosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/periodos/periodos.component';
import { CompetenciasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/competencias/competencias.component';
import { GradosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/grados/grados.component';
import { AsignacionCompetenciasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/asignacion-competencias/asignacion-competencias.component';
import { ColaboradoresComponent } from './components/layout/components/mantenimiento/mantenimiento-options/colaboradores/colaboradores.component';
import { EvaluacionPersonaComponent } from './components/layout/components/evaluacion-competencias/pages/evaluacion-persona/evaluacion-persona.component';
import { CompetenciasOuletComponent } from './components/layout/components/evaluacion-competencias/competencias-oultet.component';
import { PlanMejoraOuletComponent } from './components/layout/components/plan-de-mejora/plandemejora-oulet.component';
import { PlanMejoraListComponent } from './components/layout/components/plan-de-mejora/pages/plan-mejora-list/plan-mejora-list.component';
import { PlanMejoraResultadoComponent } from './components/layout/components/plan-de-mejora/pages/plan-mejora-resultado/plan-mejora-resultado.component';
import { PlanMejoraFormularioComponent } from './components/layout/components/plan-de-mejora/pages/plan-mejora-formulario/plan-mejora-formulario.component';
import { CursosComponent } from './components/layout/components/cursos/cursos-oulet.component';
import { CursosMantenimientoComponent } from './components/layout/components/mantenimiento/mantenimiento-options/cursos/cursos.component';
import { CursosListadoComponent } from './components/layout/components/cursos/pages/cursos-listado/cursos-listado.component';
import CursosTableroComponent from './components/layout/components/cursos/pages/cursos-tablero/cursos-tablero.component';
import { CursosMiembrosComponent } from './components/layout/components/cursos/pages/cursos-miembros/cursos-miembros.component';
import { AcuerdosComponent } from './components/layout/components/acuerdos/acuerdos.component';
import { AcuerdoDesempenioComponent } from './components/layout/components/acuerdos/acuerdo-desempenio/acuerdo-desempenio.component';
import { MiscursosComponent } from './components/layout/components/cursos/modals/miscursos/miscursos.component';
import { MetasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/metas/metas.component';
import { AsignacionMetasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/asignacion-metas/asignacion-metas.component';
import { AsignacionAcuerdoComponent } from './components/layout/components/mantenimiento/mantenimiento-options/asignacion-acuerdo/asignacion-acuerdo.component';
import { ProtocolosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/protocolos/protocolos.component';
import { SupervisorGuard } from './guards/supervisor.guard';
import { EncargadoGuard } from './guards/encargado.guard';
import { AcuerdoEditarComponent } from './components/layout/components/acuerdos/acuerdo-desempenio/acuerdo-editar/acuerdo-editar.component';
import { MiAcuerdoComponent } from './components/layout/components/acuerdos/pages/mi-acuerdo/mi-acuerdo.component';
import { AcuerdoEvaluacionComponent } from './components/layout/components/acuerdos/pages/acuerdo-evaluacion/acuerdo-evaluacion.component';
import { PeriodoProcesosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/periodo-procesos/periodo-procesos.component';
import { MinutaComponent } from './components/layout/components/acuerdos/pages/minuta/minuta.component';
import { LoginClassGuard } from './guards/login-class.guard';
import { LayoutClassGuard } from './guards/layout.guard';
import { MinutaListComponent } from './components/layout/components/acuerdos/pages/minuta-list/minuta-list.component';
import { VerAcuerdoComponent } from './components/layout/components/acuerdos/modals/ver-acuerdo/ver-acuerdo.component';
import { VerComportamientosProbatoriosComponent } from './components/layout/components/acuerdos/pages/ver-comportamientos-probatorios/ver-comportamientos-probatorios.component';
import { ReportesOuletComponent } from './components/layout/components/reportes/reportes-oulet.component';
import { ReportDashboardComponent } from './components/layout/components/reportes/pages/report-dashboard/report-dashboard.component';
import { EvaluacionProvisionalComponent } from './components/layout/components/evaluacion-competencias/pages/evaluacion-provisional/evaluacion-provisional.component';
import { EvaluacionModalviewComponent } from './components/layout/components/evaluacion-competencias/modals/evaluacion-modalview/evaluacion-modalview.component';
import { ViewSupervisadoEvaluacionComponent } from './components/layout/components/evaluacion-competencias/pages/view-supervisado-evaluacion/view-supervisado-evaluacion.component';

export const routes: Routes = [
  {
    path: 'login/:token',
    component: LoginComponent,
    // canActivate: [LayoutClassGuard]
  },

  {
    path: 'layout',
    component: LayoutComponent,
    // canActivate: [LoginClassGuard],
    children: [
      {
        path: 'acuerdos',
        component: AcuerdosComponent,
        children: [
          {
            path: '',
            component: AcuerdoDesempenioComponent,
            outlet: 'acuerdos'
          },
          {
            path: 'miacuerdo',
            component: MiAcuerdoComponent,
            outlet: 'acuerdos'
          },
          {
            path: 'minuta',
            component: MinutaComponent,
            outlet: 'acuerdos'
          },
          {
            path: 'ver-acuerdo/:id',
            component: VerAcuerdoComponent,
            outlet: 'acuerdos'
          },
          {
            path: 'comportamientos/:id',
            component: VerComportamientosProbatoriosComponent,
            outlet: 'acuerdos'
          },
          {
            path: 'editar/:id',
            component: AcuerdoEditarComponent,
            outlet: 'acuerdos'
          },
          {
            path: 'evaluacion/:id',
            component: AcuerdoEvaluacionComponent,
            outlet: 'acuerdos'
          },
        ]
      },
      {
        path: 'minutaLista',
        component: MinutaListComponent,
        // outlet: 'acuerdos'
      },
      {
        path: 'cursos',
        component: CursosComponent,
        children: [
          {
            path: '',
            component: CursosTableroComponent,
            outlet: 'cursos'
          },
          {
            path: 'listado',
            component: CursosListadoComponent,
            canActivate: [EncargadoGuard],
            outlet: 'cursos'
          },
          {
            path: 'miembros',
            component: CursosMiembrosComponent,
            canActivate: [SupervisorGuard],
            outlet: 'cursos'
          },
        ]
      },
      {
        path: 'reportes',
        component: ReportesOuletComponent,
        children: [
          {
            path: '',
            component: ReportDashboardComponent,
            outlet: 'reportes'
          },
        ]
      },
      {

        path: 'plan-de-mejora',
        component: PlanMejoraOuletComponent,
        children: [
          {
            path: '',
            component: PlanMejoraListComponent,
            outlet: 'plan-de-mejora'
          },
          {
            path: 'resultado',
            component: PlanMejoraResultadoComponent,
            outlet: 'plan-de-mejora'
          },
          {
            path: 'formulario/:id',
            component: PlanMejoraFormularioComponent,
            outlet: 'plan-de-mejora'
          }
        ]
      },
      {
        path: 'evaluacion-competencias',
        component: CompetenciasOuletComponent,
        children: [
          {
            path: '',
            component: EvalucionCompetenciasComponent
          },
          {
            path: 'evaluacion-competencia-persona',
            component: EvaluacionPersonaComponent
          },
          {
            path: 'minuta',
            component: MinutaComponent,
          },
        ]
      },
      {
        path: 'evaluacion-provisional',
        component: EvaluacionProvisionalComponent,
      },
      {
        path: 'mi-evaluacion',
        component: ViewSupervisadoEvaluacionComponent,
      },
      {
        path: 'mantenimiento',
        component: MantenimientoComponent,
        children: [
          {
            path: 'periodos',
            component: PeriodosComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'periodos-procesos',
            component: PeriodoProcesosComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'cursos',
            component: CursosMantenimientoComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'competencias',
            component: CompetenciasComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'grados',
            component: GradosComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'asignacion-competencias',
            component: AsignacionCompetenciasComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'colaboradores',
            component: ColaboradoresComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'metas',
            component: MetasComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'asignacion-metas',
            component: AsignacionMetasComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'asignacion-acuerdos',
            component: AsignacionAcuerdoComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'protocolos',
            component: ProtocolosComponent,
            outlet: 'mantenimiento'
          }
        ]
      }
    ]
  }

];
