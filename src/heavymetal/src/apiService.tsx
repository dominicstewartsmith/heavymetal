export default async function Get(route: string): Promise<string> {
  const data: Promise<string> = (await fetch('http://localhost:3000/loadall')).json()
  return data
}