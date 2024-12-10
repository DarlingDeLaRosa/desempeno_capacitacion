import { PersonSystemI, RolI } from "../components/mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface";
import { PeriodI } from '../components/mantenimiento/mantenimiento-options/periodos/interfaces/periodo.interface';

export const periodInitialState: PeriodI = {
    idPeriodo: 0,
    nombre: '',
    estado: false,
    fechaInicio: new Date,
    fechaFin: new Date,
}

export const rolInitialState: RolI = {
    idRol: 0,
    idSistema: 0,
    modulos: [],
    nombre: ""
}


export const personSystemInitialState: PersonSystemI = {
    apellidos: '',
    departamento: {
        idDepartamento: 0,
        nombre: '',
        divisiones: [] 
    },
    direccion: {
        idDireccion: 0,
        nombre: '',
        departamentos: {
            idDepartamento: 0,
            nombre: '',
            divisiones: [] 
        }
    },
    division: {
        id: 0,
        nombre: '',
        departamento: {
            idDepartamento: 0,
            nombre: ''
        },
        personas: [''] 
    },
    fechaUltimaSesion: '',
    idPersona: 0,
    idUsuario: 0,
    nombre: '',
    rol: {
        idRol: 0,
        idSistema: 0,
        modulos: [], 
        nombre: ''
    },
    unidad: '',
    username: '',
    viceRectoria: {
        idViceRectoria: 0,
        nombre: '',
        direcciones: {
            idDireccion: 0,
            nombre: '',
            departamentos: {
                idDepartamento: 0,
                nombre: '',
                divisiones: [] 
            }
        }
    }
};