const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Project ID' });
  }

  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  /**
   * Percorre cada elemento do array 
   * para satifazer a condição repository.id === id
   * Quando a condição retornar true, retorna o índice do elemento
   */
  const repositoryIndex = 
    repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository ID does not exists'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes // Número de likes salvos
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = 
    repositories.findIndex(repository => repository.id === id);

  /**
   * Caso ache repositórios através do índice,
   * remove utilizando a função splice()
   */
  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    return response
      .status(400)
      .json({ error: "Repository ID does not exists" })
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = 
    repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository ID does not exists'});
  }

  repositories[repositoryIndex].likes ++; // Adiciona likes pelo índice

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
