import React from 'react';
// import Select from 'react-select';

// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// import { uploadImg } from '../services/cloudinary.service.js';
// import { toyService } from '../services/toy.service.js';
// import { UserMsg } from '../cmps/user-msg.jsx';

import { onUpdateBoard } from '../../store/board.actions.js';
// import { setUserMsg } from '../store/user.actions.js';

import { GrClose } from 'react-icons/gr';
import { utilService } from '../../services/util.service';

class _AddBoardItem extends React.Component {
  state = {
    newItem: {
      title: '',
    },
  };

  async componentDidMount() {
    this.textInput.focus();
  }

  handleChange = (ev) => {
    const { target } = ev;
    let newItem = this.state.newItem;
    newItem[target.name] = target.value;
    this.setState({ newItem });
  };

  onAddItem = (ev) => {
    ev.preventDefault();
    const { newItem } = this.state;
    newItem.id = utilService.makeId();
    if (this.props.type === 'group') {
      const action={type: 'ADD_GROUP', group: newItem}
      this.props.onUpdateBoard(action, this.props.board);
    }
  };

  render() {
    const { title } = this.state.newItem;
    const { onToggleAddPop, type } = this.props;
    const type = this.props.type==='group' ? this.props.type : 'list'
    return (
      <section className=''>
        <form onSubmit={this.onAddItem}>
          <textarea
            placeholder={`Enter a title for this ${type}`}
            ref={(input) => {
              this.textInput = input;
            }}
            value={title}
            name='title'
            onChange={this.handleChange}
          />
          <div className='form-btns'>
            <button type='submit'>Add {type}</button>
            <button onClick={onToggleAddPop}>
              <GrClose />
            </button>
          </div>
        </form>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    board: state.boardModule.currBoard,
  };
}

const mapDispatchToProps = {
  onUpdateBoard,
};

export const AddBoardItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(_AddBoardItem);