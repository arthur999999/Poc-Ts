import { Request, Response } from "express";
import { SendFilm } from "../protocols.js";
import { filmRepository } from "../repository/filmRepository.js";
import { filmServices } from "../services/filmServices.js";

export async function postFilm (req: Request, res: Response) {

    const film: SendFilm = req.body

    try {
        
        await filmServices.verifyCategoryID(film.categoryId)

        await filmServices.verifyNameFilm(film.name)

        await filmServices.postCreatFilm(film)

        res.sendStatus(201)

    } catch (error) {
        if(error.name === 'NotFoundErrorCategory'){
            res.status(404).send(error.message)
            return
        }

        if(error.name === 'ConflictErrorFilm'){
            res.status(409).send(error.message)
            return
        }

        res.status(400).send(error.message)
    }
}

export async function concluedFilm(req: Request, res: Response){

    const filmId = req.params.id

    try {
        
        await filmServices.verifyFilmExists(filmId)

        await filmServices.concluedFilm(filmId)

        res.sendStatus(200)

    } catch (error) {
        if(error.name === 'NotFoundFilm'){
            res.status(404).send(error.message)
            return
        }

        res.status(400).send(error.message)
    }
}

export async function deleteFilm (req: Request, res: Response){

    const filmId = req.params.id

    try {

        await filmServices.verifyFilmExists(filmId)

        await filmRepository.deleteFilm(filmId)

        res.sendStatus(200)

    } catch (error) {

        if(error.name === 'NotFoundFilm'){
            res.status(404).send(error.message)
            return
        }

        res.status(400).send(error.message)
    }
}

export async function listFilms(req: Request, res: Response) {
    try {
        
        const films = await filmRepository.getFilms()

        res.status(200).send(films)

    } catch (error) {

        res.status(400).send(error.message)
    }
}

export async function listFilmsCategory(req: Request, res: Response) {
    
    const categoryId = req.params.id

    const id = Number(categoryId)

    try {
        
        await filmServices.verifyCategoryID(id)

        const filmsCategory = await filmRepository.getFilmsCategory(id)

        res.send(filmsCategory).status(200)

    } catch (error) {

        if(error.name === 'NotFoundErrorCategory'){
            res.status(404).send(error.message)
            return
        }

        res.status(400).send(error.message)
    }

}