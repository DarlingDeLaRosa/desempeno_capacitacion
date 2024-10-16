import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EvalucionCompetenciasComponent } from './components/layout/components/evaluacion-competencias/competencias-component/evalucion-competencias.component';
import { MantenimientoComponent } from './components/layout/components/mantenimiento/mantenimiento.component';
import { PeriodosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/periodos/periodos.component';
import { CompetenciasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/competencias/competencias.component';
import { GradosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/grados/grados.component';
import { AsignacionCompetenciasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/asignacion-competencias/asignacion-competencias.component';
import { ColaboradoresComponent } from './components/layout/components/mantenimiento/mantenimiento-options/colaboradores/colaboradores.component';
import { EvaluacionPersonaComponent } from './components/layout/components/evaluacion-competencias/competencias-pages/evaluacion-persona/evaluacion-persona.component';
import { CompetenciasOuletComponent } from './components/layout/components/evaluacion-competencias/competencias-oultet.component';
import { PlanMejoraOuletComponent } from './components/layout/components/plan-de-mejora/plandemejora-oulet.component';
import { PlanMejoraListComponent } from './components/layout/components/plan-de-mejora/plan-mejora-list/plan-mejora-list.component';
import { PlanMejoraResultadoComponent } from './components/layout/components/plan-de-mejora/plan-mejora-resultado/plan-mejora-resultado.component';
import { PlanMejoraFormularioComponent } from './components/layout/components/plan-de-mejora/plan-mejora-formulario/plan-mejora-formulario.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'layout',
        component: LayoutComponent,
        children:[
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
                ]
            },
            {

                path: 'plan-de-mejora',
                component: PlanMejoraOuletComponent,
                children:[
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
                    path: 'formulario',
                    component: PlanMejoraFormularioComponent,
                    outlet: 'plan-de-mejora'
                  }
                ]
            },
            {
                path: 'mantenimiento',
                component: MantenimientoComponent,
                children:[
                    {
                        path:'periodos',
                        component: PeriodosComponent,
                        outlet: 'mantenimiento'
                    },
                    {
                        path:'competencias',
                        component: CompetenciasComponent,
                        outlet: 'mantenimiento'
                    },
                    {
                        path:'grados',
                        component: GradosComponent,
                        outlet: 'mantenimiento'
                    },
                    {
                        path:'asignacion-competencias',
                        component: AsignacionCompetenciasComponent,
                        outlet: 'mantenimiento'
                    },
                    {
                        path:'colaboradores',
                        component: ColaboradoresComponent,
                        outlet: 'mantenimiento'
                    }
                ]
            }
        ]
    }

];
