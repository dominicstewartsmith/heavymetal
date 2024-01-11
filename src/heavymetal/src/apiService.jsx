export default async function Get(route) {
  const data = (await fetch("http://localhost:3000/loadall")).json();
  return data;
}

export async function AddExercise(body) {
  body = JSON.stringify(body)
  console.log("posting", body);

  await fetch("http://localhost:3000/add", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
}
