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
import { CompetenciasOuletComponent } from './components/layout/components/evaluacion-competencias/competencias-oulet.component';
import { PlanMejoraOuletComponent } from './components/layout/components/plan-de-mejora/plandemejora-oulet.component';
import { PlanMejoraListComponent } from './components/layout/components/plan-de-mejora/pages/plan-mejora-list/plan-mejora-list.component';
import { PlanMejoraResultadoComponent } from './components/layout/components/plan-de-mejora/pages/plan-mejora-resultado/plan-mejora-resultado.component';
import { PlanMejoraFormularioComponent } from './components/layout/components/plan-de-mejora/pages/plan-mejora-formulario/plan-mejora-formulario.component';
import { CursosComponent } from './components/layout/components/cursos/cursos-oulet.component';
import { CursosMantenimientoComponent } from './components/layout/components/mantenimiento/mantenimiento-options/cursos/cursos.component';
import { CursosListadoComponent } from './components/layout/components/cursos/pages/cursos-listado/cursos-listado.component';
import { CursosTableroComponent } from './components/layout/components/cursos/pages/cursos-tablero/cursos-tablero.component';
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
import { AcuerdoEvaluacionProvisionalComponent } from './components/layout/components/acuerdos/pages/acuerdo-evaluacion-provisional/acuerdo-evaluacion-provisional.component';
import { ProvisionalComponent } from './components/layout/components/evaluacion-competencias/pages/provisional-oulet/provisional-oulet.component';

export const routes: Routes = [
  {
    path: 'login/:token',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
    // canActivate: [LayoutClassGuard]
  },

  {
    path: 'layout',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    // canActivate: [LoginClassGuard],
    children: [
      {
        path: 'acuerdos',
        loadComponent: () => import('./components/layout/components/acuerdos/acuerdos.component').then(m => m.AcuerdosComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./components/layout/components/acuerdos/acuerdo-desempenio/acuerdo-desempenio.component').then(m => m.AcuerdoDesempenioComponent),
            outlet: 'acuerdos'
          },
          {
            path: 'miacuerdo',
            loadComponent: () => import('./components/layout/components/acuerdos/pages/mi-acuerdo/mi-acuerdo.component').then(m => m.MiAcuerdoComponent),
            outlet: 'acuerdos'
          },
          {
            path: 'minuta',
            loadComponent: () => import('./components/layout/components/acuerdos/pages/minuta/minuta.component').then(m => m.MinutaComponent),
            outlet: 'acuerdos'
          },
          {
            path: 'ver-acuerdo/:id',
            loadComponent: () => import('./components/layout/components/acuerdos/modals/ver-acuerdo/ver-acuerdo.component').then(m => m.VerAcuerdoComponent),
            outlet: 'acuerdos'
          },
          {
            path: 'comportamientos/:id',
            loadComponent: () => import('./components/layout/components/acuerdos/pages/ver-comportamientos-probatorios/ver-comportamientos-probatorios.component').then(m => m.VerComportamientosProbatoriosComponent),
            outlet: 'acuerdos'
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./components/layout/components/acuerdos/acuerdo-desempenio/acuerdo-editar/acuerdo-editar.component').then(m => m.AcuerdoEditarComponent),
            outlet: 'acuerdos'
          },
          {
            path: 'evaluacion/:id',
            loadComponent: () => import('./components/layout/components/acuerdos/pages/acuerdo-evaluacion/acuerdo-evaluacion.component').then(m => m.AcuerdoEvaluacionComponent),
            outlet: 'acuerdos'
          },
        ]
      },
      {
        path: 'minutaLista',
        loadComponent: () => import('./components/layout/components/acuerdos/pages/minuta-list/minuta-list.component').then(m => m.MinutaListComponent),
        // outlet: 'acuerdos'
      },
      {
        path: 'cursos',
        loadComponent: () => import('./components/layout/components/cursos/cursos-oulet.component').then(m => m.CursosComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./components/layout/components/cursos/pages/cursos-tablero/cursos-tablero.component').then(m => m.CursosTableroComponent),
            outlet: 'cursos'
          },
          {
            path: 'listado',
            loadComponent: () => import('./components/layout/components/cursos/pages/cursos-listado/cursos-listado.component').then(m => m.CursosListadoComponent),
            canActivate: [EncargadoGuard],
            outlet: 'cursos'
          },
          {
            path: 'miembros',
            loadComponent: () => import('./components/layout/components/cursos/pages/cursos-miembros/cursos-miembros.component').then(m => m.CursosMiembrosComponent),
            canActivate: [SupervisorGuard],
            outlet: 'cursos'
          },
        ]
      },
      {
        path: 'reportes',
        loadComponent: () => import('./components/layout/components/reportes/reportes-oulet.component').then(m => m.ReportesOuletComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./components/layout/components/reportes/pages/report-dashboard/report-dashboard.component').then(m => m.ReportDashboardComponent),
            outlet: 'reportes'
          },
        ]
      },
      {

        path: 'plan-de-mejora',
        loadComponent: () => import('./components/layout/components/plan-de-mejora/plandemejora-oulet.component').then(m => m.PlanMejoraOuletComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./components/layout/components/plan-de-mejora/pages/plan-mejora-list/plan-mejora-list.component').then(m => m.PlanMejoraListComponent),
            outlet: 'plan-de-mejora'
          },
          {
            path: 'resultado',
            loadComponent: () => import('./components/layout/components/plan-de-mejora/pages/plan-mejora-resultado/plan-mejora-resultado.component').then(m => m.PlanMejoraResultadoComponent),
            outlet: 'plan-de-mejora'
          },
          {
            path: 'formulario/:id',
            loadComponent: () => import('./components/layout/components/plan-de-mejora/pages/plan-mejora-formulario/plan-mejora-formulario.component').then(m => m.PlanMejoraFormularioComponent),
            outlet: 'plan-de-mejora'
          }
        ]
      },
      {
        path: 'evaluacion-competencias',
        loadComponent: () => import('./components/layout/components/evaluacion-competencias/competencias-oulet.component').then(m => m.CompetenciasOuletComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./components/layout/components/evaluacion-competencias/pages/competencias/evalucion-competencias.component').then(m => m.EvalucionCompetenciasComponent)
          },
          {
            path: 'evaluacion-competencia-persona',
            loadComponent: () => import('./components/layout/components/evaluacion-competencias/pages/evaluacion-persona/evaluacion-persona.component').then(m => m.EvaluacionPersonaComponent)
          },
          {
            path: 'minuta',
            loadComponent:() => import('./components/layout/components/acuerdos/pages/minuta/minuta.component').then(m => m.MinutaComponent),
          },
        ]
      },
      {
        path: 'evaluacion-provisional',
        loadComponent: () => import('./components/layout/components/evaluacion-competencias/pages/evaluacion-provisional/evaluacion-provisional.component').then(m => m.EvaluacionProvisionalComponent),
      },
      {
        path: 'acuerdos-provisional',
        loadComponent: () => import('./components/layout/components/evaluacion-competencias/pages/provisional-oulet/provisional-oulet.component').then(m => m.ProvisionalComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./components/layout/components/acuerdos/pages/acuerdo-evaluacion-provisional/acuerdo-evaluacion-provisional.component').then(m => m.AcuerdoEvaluacionProvisionalComponent),
            outlet: 'acuerdos-provisional'
          },
          {
            path: 'miacuerdo',
            loadComponent: () => import('./components/layout/components/acuerdos/pages/mi-acuerdo/mi-acuerdo.component').then(m => m.MiAcuerdoComponent),
            outlet: 'acuerdos-provisional'
          },
          {
            path: 'minuta',
            loadComponent: () => import('./components/layout/components/acuerdos/pages/minuta/minuta.component').then(m => m.MinutaComponent),
            outlet: 'acuerdos-provisional'
          },
          {
            path: 'ver-acuerdo/:id',
            loadComponent: () => import('./components/layout/components/acuerdos/modals/ver-acuerdo/ver-acuerdo.component').then(m => m.VerAcuerdoComponent),
            outlet: 'acuerdos-provisional'
          },
          {
            path: 'comportamientos/:id',
            loadComponent: () => import('./components/layout/components/acuerdos/pages/ver-comportamientos-probatorios/ver-comportamientos-probatorios.component').then(m => m.VerComportamientosProbatoriosComponent),
            outlet: 'acuerdos-provisional'
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./components/layout/components/acuerdos/acuerdo-desempenio/acuerdo-editar/acuerdo-editar.component').then(m => m.AcuerdoEditarComponent),
            outlet: 'acuerdos-provisional'
          },
          {
            path: 'evaluacion/:id',
            loadComponent: () => import('./components/layout/components/acuerdos/pages/acuerdo-evaluacion/acuerdo-evaluacion.component').then(m => m.AcuerdoEvaluacionComponent),
            outlet: 'acuerdos-provisional'
          },
        ]
      },
      {
        path: 'mi-evaluacion',
        loadComponent: () => import('./components/layout/components/evaluacion-competencias/pages/view-supervisado-evaluacion/view-supervisado-evaluacion.component').then(m => m.ViewSupervisadoEvaluacionComponent),
      },
      {
        path: 'mantenimiento',
        loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento.component').then(m => m.MantenimientoComponent),
        children: [
          {
            path: 'periodos',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/periodos/periodos.component').then(m => m.PeriodosComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'periodos-procesos',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/periodo-procesos/periodo-procesos.component').then(m => m.PeriodoProcesosComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'cursos',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/cursos/cursos.component').then(m => m.CursosMantenimientoComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'competencias',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/competencias/competencias.component').then(m => m.CompetenciasComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'grados',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/grados/grados.component').then(m => m.GradosComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'asignacion-competencias',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/asignacion-competencias/asignacion-competencias.component').then(m => m.AsignacionCompetenciasComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'colaboradores',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/colaboradores/colaboradores.component').then(m => m.ColaboradoresComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'metas',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/metas/metas.component').then(m => m.MetasComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'asignacion-metas',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/asignacion-metas/asignacion-metas.component').then(m => m.AsignacionMetasComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'asignacion-acuerdos',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/asignacion-acuerdo/asignacion-acuerdo.component').then(m => m.AsignacionAcuerdoComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'protocolos',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/protocolos/protocolos.component').then(m => m.ProtocolosComponent),
            outlet: 'mantenimiento'
          },
          {
            path: 'cambio-sup',
            loadComponent: () => import('./components/layout/components/mantenimiento/mantenimiento-options/supervisor-change/supervisor-change.component').then(m => m.SupervisorChangeComponent),
            outlet: 'mantenimiento'
          }
        ]
      }
    ]
  }

];
