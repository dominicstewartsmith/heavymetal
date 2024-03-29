const URL_ROOT = "http://localhost";
const PORT = 3000;
const PATH = `${URL_ROOT}:${PORT}/`;

export async function apiGetExerciseData() {
  const data = (await fetch(PATH + "exercises")).json();
  return data;
}

export async function apiGetLogData(date) {
  const data = (await fetch(PATH + "log/" + date)).json();
  return data;
}

export async function apiAddNewExercise(body) {
  body = JSON.stringify(body);

  await fetch(PATH + "addNew", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
}

export async function apiDeleteExercise(body) {
  body = JSON.stringify(body);

  await fetch(PATH + "delete", {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
}

export async function apiAddToLog(data) {
  data = JSON.stringify(data);

  await fetch(PATH + "addLog", {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

export async function apiDeleteFromLog(data) {
  data = JSON.stringify(data);

  await fetch(PATH + "deleteLog", {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

export async function apiAddNewSet(data) {
  data = JSON.stringify(data);

  await fetch(PATH + "addNewSet", {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

export async function apiUpdateSet(data) {
  data = JSON.stringify(data);

  await fetch(PATH + "updateSet", {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

export async function apiDeleteSet(data) {
  data = JSON.stringify(data);

  await fetch(PATH + "deleteSet", {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}
