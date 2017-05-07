import * as React from 'react'
import itworx from '../../workers/itworx'
import * as Actions from '../../constants/actions'
import * as styles from './new-post-modal.css'
interface Props {
    // empty
}
interface State {
    visible: boolean
}

export default class NewPostModal extends React.Component<Props, State> {

    private title: HTMLInputElement
    private content: HTMLTextAreaElement

    constructor(props: Props){
        super(props)

        this.state = { visible: false }

        this.closeModal = this.closeModal.bind(this)
        this.showModal = this.showModal.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }

    componentDidMount(){
        itworx.subscribe(Actions.SHOW_NEW_POST_MODAL, this.showModal)
    }

    showModal(action: Action){
        this.setState({visible: action.payload})
    }
    closeModal() {
        itworx.dispatch({type: Actions.SHOW_NEW_POST_MODAL, payload: false})
    }

    submitForm(){
        const payload = {title: this.title.value, content: this.content.value}
        itworx.dispatch({type: Actions.ADD_NEW_POST, payload })
        this.closeModal()
    }

    render(){
        if(!this.state.visible) return null
        return (
        <div className={styles.overlay} onClick={this.closeModal}>
            <div className={"modal-dialog"} 
                role="document" 
                onClick={e=>e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" 
                            className="close" 
                            data-dismiss="modal" 
                            aria-label="Close"
                            onClick={this.closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">Add Post</h4>
                    </div>
                    <div className="modal-body">
                         <div className="form-group">
                            <input type="text" 
                                className="form-control" 
                                ref={element=>this.title=element}
                                placeholder="Title"/>
                        </div>
                        <textarea type="text" 
                            className="form-control" 
                            ref={element=>this.content=element}
                            placeholder="type ypur post here"/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" 
                            className="btn btn-default" 
                            data-dismiss="modal"
                            onClick={this.closeModal}>
                            Cancel
                        </button>
                        <button type="button" 
                            className="btn btn-primary"
                            onClick={this.submitForm}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
        )
    }

}