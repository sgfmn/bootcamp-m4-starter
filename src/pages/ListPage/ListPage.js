import React, { Component } from 'react';
import './ListPage.css';
import store from '../../redux/store';
import {connect} from 'react-redux'

class ListPage extends Component {
    state = {
        id: '',
        movies: [],
        title: ""
    }

    loadFilms = async () => {
        const res = await fetch(`https://acb-api.algoritmika.org/api/movies/list/${this.props.id}`)
        const {movies, title} = await res.json()
        this.setState({title})
        movies.forEach(item => {
            fetch(`http://www.omdbapi.com/?i=${item}&apikey=b41237ea`)
            .then(res => res.json())
            .then(data => {
                const objForPush = {
                    Title: data.Title,
                    Year: data.Year,
                    imdbID: data.imdbID,
                }
                const newMovies = [...this.state.movies]
                newMovies.push(objForPush)
                this.setState({movies: newMovies})
            })
        })
    }

    componentDidMount() {  
        this.loadFilms() 
    }

    render() {
        // console.log(this.state.movies)
        return (
            <div className="list-page">
                <h1 className="list-page__title">{this.state.title}</h1>
                <ul>
                    {this.state.movies.map((item) => {
                        return (
                            <li key={item.imdbID}>
                                <a href={`https://www.imdb.com/title/${item.imdbID}`} target="_blank">{item.Title} ({item.Year})</a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        id: state.id
    }
}

export default connect(mapStateToProps)(ListPage);
