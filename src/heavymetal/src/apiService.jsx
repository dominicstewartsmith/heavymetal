export default async function apiGet(route) {
  const data = (await fetch("http://localhost:3000/loadall")).json();
  return data;
}

export async function apiAddExercise(body) {
  body = JSON.stringify(body)

  await fetch("http://localhost:3000/add", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
}

export async function apiDeleteExercise(body) {
  body = JSON.stringify(body)

  await fetch("http://localhost:3000/delete", {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
}
