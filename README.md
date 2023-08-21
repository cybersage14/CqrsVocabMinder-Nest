# NestJS App
# Vocabulary Learning and Retention Application

## Project Description

Welcome to the Vocabulary Learning and Retention Application! This project is designed to empower users with efficient techniques for learning and retaining new vocabulary. With its intuitive interface and powerful features, language learners can seamlessly create, organize, and review their vocabulary items.

## Key Features

- **Vocabulary Creation:** Effortlessly add new words to your personal vocabulary list. Each entry includes the term and its definition, ensuring clarity and comprehensive understanding.

- **Word Boxes:** The application introduces the concept of "Word Boxes," which enable users to group related words into customizable collections. These thematic Word Boxes facilitate focused learning by allowing users to target specific topics or categories.

- **Retention Strategies:** Employ personalized retention strategies by marking Word Boxes as "Learned" when you feel confident in your grasp of the vocabulary. This adaptable approach empowers learners to customize their learning experience.

- **Box Organization:** Enhance your learning organization by creating hierarchies of Word Boxes within larger "Boxes." This hierarchical structure provides a flexible framework for structuring your vocabulary learning process.

## How It Works

1. **Vocabulary Creation:** Start your learning journey by adding new words to your personal vocabulary list. Each entry consists of a term and its corresponding definition.

2. **Word Box Creation:** Organize your vocabulary effectively by grouping related words into Word Boxes. Customize the title and description of each Word Box to tailor your learning experience.

3. **Retention Planning:** Boost retention by designating Word Boxes as "Learned" once you're confident in your understanding. This enables targeted review while allowing you to focus on acquiring new vocabulary.

4. **Hierarchy Creation:** For comprehensive organization, group Word Boxes into larger "Boxes." This feature enhances management and tracking of your overall vocabulary progress.

5. **Continuous Learning:** Regularly revisit your vocabulary items and Word Boxes to ensure retention. Adapt your learning strategy by transferring words between boxes as your proficiency grows.

## To-Do

- [ ] Develop the user interface (UI) for the application. 
- [ ] add Progress Tracking for user for back-end

Feel free to customize the task description as needed. This "To-Do" section allows you to outline tasks you plan to work on, keeping yourself and potential contributors informed about the ongoing development of the project.

### Installation:
``` bash 
#1. clone this project 
$ git clone https://github.com/sg-milad/nest-cqrs-vocabMinder
#2. go to directory 
$ cd /nest-cqrs-vocabMinder
$ cp .env.example .env
$ docker-compose up
```

### [open doc](https://localhost:3000/doc)
### Test
you have to create new database for testing

```bash
$ docker exec -it nest-db bash 
$ psql -U postgres
$ SELECT 'CREATE DATABASE test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'test')\gexec
# output: CREATE DATABASE
```
### run e2e tests
```
$ npm run test:e2e
```

## Features

<dt><b>JWT Authentication</b></dt>
<dd>Installed and configured JWT authentication.</dd>

<dt><b>Environment Configuration</b></dt>
<dd>development, staging and production environment configurations</dd>
  
<dt><b>Swagger Api Documentation</b></dt>
<dd>Already integrated API documentation. To see all available endpoints visit http://localhost:3000/doc<dd>
