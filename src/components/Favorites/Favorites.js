import React, { Component } from 'react';
import './Favorites.css';
import store from '../../redux/store';
import { Link } from 'react-router-dom';
import { addList, deleteItem } from '../../redux/actions'

class Favorites extends Component {
    state = {
        title: "",
        fav: [], 
        id: ''
    }

    componentDidMount() {
        store.subscribe(() => {

            // console.log(this.state.title)
            const storeState = store.getState();
            const { fav, id } = storeState;
            this.setState({ fav, id });
        })
    }

    createList = () => {
        const ids = this.state.fav.map(item => item.imdbID);
        fetch('https://acb-api.algoritmika.org/api/movies/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: this.state.title,
                movies: ids
            })
        }).then(res => res.json())
            .then(data => {
                store.dispatch(addList(data.id));
            })
    }

    listName = (event) => {
        this.setState({ title: event.target.value });
    }

    delBtn = (index) => {
        store.dispatch(deleteItem(index));
    }

    render() {
        return (
            <div className="favorites">
                <input value={this.state.title} placeholder="Новый список" className="favorites__name" onChange={event => this.listName(event)} />
                <ul className="favorites__list">
                    {this.state.fav.map((item, index) => {
                        return (
                            <div className='fav-el'>
                                <li key={item.imdbID}>
                                    {item.Title} ({item.Year})
                                </li>
                                <button className="btn-del" onClick={() => this.delBtn(index)}>
                                    X
                                </button>
                            </div>);
                    })}
                </ul>
                <button type="button" className="favorites__save" onClick={this.createList}>Сохранить список</button>
                <hr />
                {this.state.id
                    ? <Link target='_blank' to="/list/:id">Список</Link>
                    : null
                }
            </div>
        );
    }
}

export default Favorites;
