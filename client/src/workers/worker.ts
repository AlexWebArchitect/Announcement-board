import * as Actions from '../constants/actions'
import axios from 'axios'
import * as api from './api'

interface State {
// data
    posts: Array<PostListItem>
// display
    newPostModalIsVisible: boolean
    editPostModalIsVisible: boolean
}

const state: State = {
    posts: [],
    newPostModalIsVisible: false,
    editPostModalIsVisible: true
}

function onMessage(event) {
    const {type, payload}: Action = event.data
    switch(type){
// api        
        case Actions.LOAD_LAST_POSTS:
            api.loadLastPosts()
            .then(payload => {
                state.posts = payload
                self.postMessage.apply(null, [{type: Actions.LOAD_LAST_POSTS, payload}])
            })
            break
        case Actions.DELETE_POST_ITEM:
            api.deletePosts(payload)
                .then(response => {
                    state.posts = state.posts.filter(item => item.id != payload)
                    self.postMessage.apply(null,[{type: Actions.LOAD_LAST_POSTS, payload: state.posts}])
                })
            break
        case Actions.EDIT_POST_ITEM: 
            self.postMessage.apply(null, [event.data])
            break
        case Actions.UPDATE_POST_ITEM:
            api.updatePosts(payload)
                .then(response => {
                    const post = response[0]
                    const idx = state.posts.findIndex(item => item.id == post.id)
                    state.posts[idx] = post
                    self.postMessage.apply(null,[{type: Actions.LOAD_LAST_POSTS, payload: state.posts}])
                })
            break
        case Actions.SEARCH_POST_ITEM: 
            self.postMessage.apply(null, [{
                type: Actions.LOAD_LAST_POSTS, 
                payload: state.posts.filter(item => (
                    item.title.toUpperCase().includes(payload.toUpperCase()) || 
                    item.content.toUpperCase().includes(payload.toUpperCase())))
            }])
            break
        case Actions.ADD_NEW_POST:
            api.addPosts(payload)
                .then(post => {
                    state.posts = [...post,...state.posts]
                    self.postMessage.apply(null,[{type: Actions.LOAD_LAST_POSTS, payload: state.posts}])
                })
            break
// display
        case Actions.SHOW_NEW_POST_MODAL:
            state.newPostModalIsVisible = payload
            self.postMessage.apply(null, [event.data])
            break
    }
}

self.addEventListener('message', onMessage)

