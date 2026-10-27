# Evaluacion Parcial N 2 - AUY1102

## Ciclo de Vida del Software I - Desarrollo de Pruebas Unitarias y Analisis de Seguridad

**Integrantes:** [NOMBRE 1] - [NOMBRE 2]

**Repositorio:** [URL DEL FORK]

**Fecha:** Octubre 2026

---

## Parte 1: Analisis de Codigo mediante Pruebas Unitarias

### 1.1 Creacion del Fork

Se realizo un fork del repositorio original proporcionado por el docente:

- **Repositorio original:** `https://github.com/Fundacion-Instituto-Profesional-Duoc-UC/AUY1102-Pipeline`
- **Fork creado en:** `https://github.com/[TU_USUARIO]/AUY1102-Pipeline`

Pasos realizados:

1. Ingresamos al repositorio original en GitHub.
2. Hicimos clic en el boton **Fork** en la esquina superior derecha.
3. Seleccionamos nuestra cuenta como destino del fork.
4. Clonamos el repositorio localmente con:

```bash
git clone https://github.com/[TU_USUARIO]/AUY1102-Pipeline.git
cd AUY1102-Pipeline
```

### 1.2 Instalacion de dependencias

```bash
npm install
```

Se instalaron todas las dependencias del proyecto, incluyendo Jest como framework de pruebas unitarias y SWC como transpilador de TypeScript.

### 1.3 Ejecucion de pruebas unitarias

Se creo un workflow de GitHub Actions (`.github/workflows/test-coverage.yml`) que ejecuta automaticamente las pruebas unitarias y genera el reporte de cobertura.

Para ejecutar las pruebas localmente:

```bash
npx jest --coverage --verbose
```

### 1.4 Resultados de las pruebas

**Total de tests:** 18
**Tests exitosos:** 18
**Tests fallidos:** 0

Detalle de los test suites ejecutados:

| Test Suite | Tests | Estado |
|---|---|---|
| EnumValueObject/checkValueIsValid | 1 | PASS |
| NumberValueObject/isBiggerThan | 2 | PASS |
| NumberValueObject/equalsTo | 2 | PASS |
| NumberValueObject/isSmallerThan | 2 | PASS |
| StringValueObject/equalsTo | 2 | PASS |
| StringValueObject/differentTo | 2 | PASS |
| StringValueObject/hasMoreCharacterThan | 2 | PASS |
| StringValueObject/hasLessCharacterThan | 2 | PASS |
| StringValueObject/isEmpty | 2 | PASS |
| StringValueObject/toString | 1 | PASS |

### 1.5 Cobertura de codigo

| Archivo | % Stmts | % Branch | % Funcs | % Lines | Lineas no cubiertas |
|---|---|---|---|---|---|
| **Total** | **39.18%** | **60%** | **53.12%** | **39.18%** | |
| src/index.ts | 62.5% | 100% | 25% | 62.5% | 8-10 |
| src/quality/errores-object.ts | 0% | 100% | 0% | 0% | 2-6 |
| src/quality/insecure-1-object.ts | 0% | 100% | 0% | 0% | 1-27 |
| src/quality/insecure-2-object.ts | 0% | 100% | 0% | 0% | 1-32 |
| src/value-object/index.ts | 100% | 100% | 100% | 100% | - |
| src/value-object/primitives/date-value-object.ts | 6.66% | 0% | 0% | 6.66% | 3-35 |
| src/value-object/primitives/enum-value-object.ts | 83.33% | 0% | 100% | 83.33% | 11 |
| src/value-object/primitives/index.ts | 100% | 100% | 100% | 100% | - |
| src/value-object/primitives/number-value-object.ts | 100% | 100% | 100% | 100% | - |
| src/value-object/primitives/string-value-object.ts | 100% | 100% | 100% | 100% | - |

### 1.6 Analisis de la cobertura

- **Archivos con cobertura completa (100%):** `number-value-object.ts`, `string-value-object.ts`, `index.ts` (ambos). Estos archivos tienen pruebas unitarias que cubren todas sus funciones.
- **Archivos parcialmente cubiertos:**
  - `date-value-object.ts` (6.66%): No existen pruebas unitarias para la clase DateValueObject. Falta cubrir los metodos `checkDateIsValue`, `format`, `isBetweenTheDates`, `isBeforeThisDate` e `isAfterThisDate`.
  - `enum-value-object.ts` (83.33%): Falta cubrir la linea 11, que corresponde al metodo abstracto `throwErrorForInvalidValue`.
- **Archivos sin cobertura (0%):** Los archivos en `src/quality/` no tienen pruebas unitarias. Estos archivos contienen codigo con errores intencionales y vulnerabilidades de seguridad que son objeto de analisis en la Parte 2.
- **src/index.ts (62.5%):** Las lineas 8-10 no estan cubiertas; corresponden al manejo de errores de la funcion `fetchData` que realiza llamadas HTTP externas.

---

## Parte 2: Analisis de Seguridad de Codigo Estatico

### 2.1 Configuracion de SonarCloud

#### Pasos realizados:

1. **Crear cuenta en SonarCloud:**
   - Ingresamos a [sonarcloud.io](https://sonarcloud.io) e iniciamos sesion con nuestra cuenta de GitHub.

2. **Importar el proyecto:**
   - En el dashboard de SonarCloud, seleccionamos "Analyze new project".
   - Seleccionamos nuestro fork `AUY1102-Pipeline` de la lista de repositorios.
   - SonarCloud creo automaticamente la organizacion y el proyecto.

3. **Configurar el archivo `sonar-project.properties`:**
   - Se creo el archivo `sonar-project.properties` en la raiz del repositorio con la configuracion del proyecto (projectKey, organizacion, rutas de fuentes y tests, y ruta del reporte de cobertura LCOV).

4. **Configurar el secreto SONAR_TOKEN:**
   - En SonarCloud, fuimos a Account > Security > Generate Token.
   - Copiamos el token generado.
   - En el repositorio de GitHub, fuimos a Settings > Secrets and variables > Actions > New repository secret.
   - Creamos el secreto `SONAR_TOKEN` con el valor del token.

5. **Crear el workflow de GitHub Actions:**
   - Se creo el archivo `.github/workflows/sonarcloud.yml` que ejecuta el analisis de SonarCloud automaticamente en cada push y pull request.

#### Hallazgos de SonarCloud:

SonarCloud detecta los siguientes problemas en el codigo:

- **Bugs:** Error de tipo en `errores-object.ts` donde se asigna un `number` a una variable de tipo `string`.
- **Vulnerabilidades:** SQL Injection, XSS, SSTI (Server-Side Template Injection), credenciales hardcodeadas.
- **Code Smells:** Clase con multiples responsabilidades en `errores-object.ts` (UserService), codigo muerto, console.log en produccion.
- **Security Hotspots:** Archivo `credentials.yml` con token de GitHub expuesto, API keys en `src/index.ts`.

### 2.2 Configuracion de Snyk

#### Pasos realizados:

1. **Crear cuenta en Snyk:**
   - Ingresamos a [snyk.io](https://snyk.io) e iniciamos sesion con nuestra cuenta de GitHub.

2. **Importar el proyecto:**
   - En el dashboard de Snyk, seleccionamos "Add project" > "GitHub".
   - Seleccionamos nuestro fork `AUY1102-Pipeline`.
   - Snyk analizo automaticamente el `package.json` y `package-lock.json`.

3. **Configurar el secreto SNYK_TOKEN:**
   - En Snyk, fuimos a Account Settings > Auth Token.
   - Copiamos el token.
   - En GitHub, creamos el secreto `SNYK_TOKEN` en Settings > Secrets and variables > Actions.

4. **Crear el workflow de GitHub Actions:**
   - Se creo el archivo `.github/workflows/snyk.yml` que ejecuta tanto el analisis de dependencias como el analisis de codigo estatico (SAST) de Snyk.

#### Hallazgos de Snyk:

Snyk detecta vulnerabilidades en las dependencias del proyecto, incluyendo:

- Vulnerabilidades en `@babel/core`, `@babel/helpers`, `tar`, `tmp`, entre otras.
- Problemas de seguridad en dependencias transitivas.
- Recomendaciones de actualizacion para resolver las vulnerabilidades.

### 2.3 Remediacion de hallazgos

Se realizo la remediacion del archivo `src/quality/insecure-2-object.ts`, corrigiendo los siguientes problemas:

#### SQL Injection (Antes vs Despues):

**Antes (vulnerable):**
```typescript
const username = "admin'; DROP TABLE Users; --";
const queryString = `SELECT * FROM Users WHERE username='${username}'`;
```

**Despues (seguro):**
```typescript
const username = "admin";
const queryString = "SELECT * FROM Users WHERE username = ?";
const queryParams = [username];
```

Se reemplazo la interpolacion directa de variables en la consulta SQL por una consulta parametrizada, evitando la inyeccion de codigo malicioso.

#### XSS - Cross-Site Scripting (Antes vs Despues):

**Antes (vulnerable):**
```typescript
const userInput = '<script>alert("XSS");</script>';
const html = `<div>${userInput}</div>`;
```

**Despues (seguro):**
```typescript
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
const userInput = '<script>alert("XSS");</script>';
const html = `<div>${sanitizeHtml(userInput)}</div>`;
```

Se implemento una funcion de sanitizacion que escapa caracteres especiales HTML antes de renderizar la entrada del usuario.

#### Credenciales hardcodeadas (Antes vs Despues):

**Antes (vulnerable):**
```typescript
const dbPassword = 'password123';
const config = {
  dbUsername: 'admin',
  dbPassword: 'password123',
  apiKey: 'abc123',
};
console.log(`Error: La contraseña ${dbPassword} no es válida`);
```

**Despues (seguro):**
```typescript
const dbPassword = process.env['DB_PASSWORD'] || '';
const config = {
  dbUsername: process.env['DB_USERNAME'] || '',
  dbPassword: process.env['DB_PASSWORD'] || '',
  apiKey: process.env['API_KEY'] || '',
};
console.log('Error: credenciales no validas');
```

Se reemplazaron las credenciales hardcodeadas por variables de entorno y se elimino la exposicion de contraseñas en los mensajes de log.

### 2.4 Ejecucion de npm audit

Se configuro un workflow de GitHub Actions (`.github/workflows/npm-audit.yml`) que ejecuta `npm audit` automaticamente.

Ejecucion local:

```bash
npm audit
```

#### Resultados de npm audit:

| Severidad | Cantidad |
|---|---|
| Critica | 2 |
| Alta | 48 |
| Moderada | 22 |
| Baja | 5 |
| **Total** | **77 vulnerabilidades** |

Las vulnerabilidades mas relevantes incluyen:

- `@babel/core` <= 7.29.0: Lectura arbitraria de archivos via sourceMappingURL
- `@faker-js/faker` <= 10.4.0: Ejecucion arbitraria de codigo via helpers.fake
- `tar` (node-tar): Multiples vulnerabilidades de path traversal y symlink poisoning
- `tmp` <= 0.2.5: Escritura arbitraria de archivos via symlink

Para remediar:

```bash
npm audit fix          # Corrige vulnerabilidades sin breaking changes
npm audit fix --force  # Corrige todas, incluyendo breaking changes
```

### 2.5 GitHub Advanced Security

#### Pasos realizados:

1. **Activar GitHub Advanced Security:**
   - En el repositorio, fuimos a Settings > Code security and analysis.
   - Activamos **Dependency graph** (analisis de dependencias).
   - Activamos **Dependabot alerts** para recibir alertas de vulnerabilidades en dependencias.
   - Activamos **Dependabot security updates** para recibir PRs automaticos de correccion.
   - Activamos **Secret scanning** para detectar secretos expuestos en el codigo.

2. **CodeQL ya configurado:**
   - El repositorio ya contiene un workflow de CodeQL en `.github/workflows/codeql.yml` que realiza analisis de seguridad estatico del codigo JavaScript/TypeScript.
   - CodeQL se ejecuta automaticamente en cada push a master y en pull requests.

3. **Dependabot configurado:**
   - El archivo `.github/dependabot.yml` ya esta configurado para verificar actualizaciones de dependencias npm semanalmente.

#### Hallazgos de GitHub Advanced Security:

- **Secret Scanning:** Detecta el token de GitHub expuesto en `credentials.yml` y las API keys en `src/index.ts`.
- **CodeQL:** Detecta vulnerabilidades como Server-Side Template Injection en `insecure-1-object.ts` y SQL Injection en `insecure-2-object.ts`.
- **Dependabot:** Genera alertas para las 77 vulnerabilidades encontradas en las dependencias.

---

## Parte 3: Resumen y conclusiones

### Herramientas utilizadas

| Herramienta | Tipo de analisis | Proposito |
|---|---|---|
| Jest | Pruebas unitarias | Verificar el comportamiento correcto del codigo y medir cobertura |
| SonarCloud | Analisis estatico (SAST) | Detectar bugs, vulnerabilidades, code smells y medir calidad |
| Snyk | Analisis de dependencias y SAST | Detectar vulnerabilidades en dependencias y en el codigo fuente |
| npm audit | Analisis de dependencias | Detectar vulnerabilidades conocidas en paquetes npm |
| CodeQL (GitHub) | Analisis estatico (SAST) | Detectar patrones de codigo vulnerables |
| Dependabot (GitHub) | Analisis de dependencias | Alertas y PRs automaticos para dependencias vulnerables |
| Secret Scanning (GitHub) | Deteccion de secretos | Identificar tokens, claves y credenciales expuestas en el codigo |

### Impacto en el ciclo de vida del software

La implementacion de estas herramientas dentro de un pipeline CI/CD permite:

1. **Deteccion temprana de errores:** Las pruebas unitarias se ejecutan automaticamente en cada push, evitando que codigo defectuoso llegue a produccion.
2. **Seguridad continua:** Los analisis de SonarCloud, Snyk y CodeQL se ejecutan en cada cambio, detectando vulnerabilidades antes del merge.
3. **Gestion de dependencias:** npm audit y Dependabot mantienen las dependencias actualizadas y libres de vulnerabilidades conocidas.
4. **Proteccion de secretos:** Secret Scanning previene la filtracion accidental de credenciales y tokens.
5. **Mejora continua:** Los reportes de cobertura y calidad permiten identificar areas del codigo que necesitan mas pruebas o refactorizacion.

### Archivos creados/modificados en este proyecto

| Archivo | Descripcion |
|---|---|
| `.github/workflows/test-coverage.yml` | Workflow para pruebas unitarias y cobertura |
| `.github/workflows/sonarcloud.yml` | Workflow para analisis con SonarCloud |
| `.github/workflows/snyk.yml` | Workflow para analisis con Snyk |
| `.github/workflows/npm-audit.yml` | Workflow para npm audit y dependency review |
| `sonar-project.properties` | Configuracion del proyecto en SonarCloud |
| `src/quality/insecure-2-object.ts` | Remediacion de vulnerabilidades de seguridad |
| `EVALUACION.md` | Este documento de documentacion |
