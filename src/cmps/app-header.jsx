import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { CgHome } from 'react-icons/cg';
import { AiOutlinePlus, AiOutlineBell } from 'react-icons/ai';
import { SiTrello } from 'react-icons/si';


// import routes from '../routes'
import { onLogin, onLogout, onSignup, loadUsers, removeUser } from '../store/user.actions.js'
import { setAddingBoard } from '../store/board.actions'
import { BoardAdd } from './board/board-add.jsx';
import { MemberAvatar } from './shared/member-avatar.jsx';
import { OverlayScreen } from '../cmps/overlay-screen'
import { DynamicPopover } from './shared/dynamic-popover.jsx';
import { InviteMembers } from './board/invite-members.jsx';


class _AppHeader extends React.Component {
    state = {
        isPopoverOpen: false
    }

    componentDidMount() {
        
    }

    userMenuRef = React.createRef()

    onLogout = () => {
        this.props.onLogout()
    }

    setAddBoard = (value) => {
        this.props.setAddingBoard(value)
    }

    setFavicon = () => {
        const favicon = document.getElementById('favicon')
        favicon.href = '../../public/favicon.ico'
    }

    render() {
        const { user, isAddingBoard } = this.props
        const { isPopoverOpen } = this.state
        return (
            <header className="app-header">
                <nav className="nav-links">
                    <div className="left-links">
                        <NavLink to="/"><button onClick={() => this.setFavicon()} className="home-btn nav-button"><CgHome /></button></NavLink>
                        <NavLink to="/board"><button onClick={() => this.setFavicon()} className="boards-btn flex nav-button"><SiTrello /> <span>Boards</span></button></NavLink>
                    </div>
                    <NavLink className="logo" to="/"><SiTrello /> <span> Marshmello </span></NavLink>
                    <div className="right-links">
                        <button className="nav-button" onClick={() => this.setAddBoard(true)}><AiOutlinePlus /></button>
                        <button className="nav-button"><AiOutlineBell /></button>
                        <MemberAvatar key={user._id} member={user} onClick={() => this.setState({ isPopoverOpen: !isPopoverOpen })} />
                        {/* <div className='relative' ref={this.userMenuRef}>
                            {isPopoverOpen && <DynamicPopover onClose={() => this.setState({ isPopoverOpen: false })} title="Invite Members" ref={this.userMenuRef}>
                                <InviteMembers />
                            </DynamicPopover>}
                        </div> */}
                    </div>
                </nav>
                {isAddingBoard && <BoardAdd onClose={() => this.setAddBoard(false)} />}
                {isAddingBoard && <OverlayScreen />}
            </header>
        )
    }
}

function mapStateToProps(state) {
    return {
        board: state.boardModule.currBoard,
        user: state.userModule.user,
        isAddingBoard: state.boardModule.isAddingBoard
    }
}
const mapDispatchToProps = {
    onLogin,
    onSignup,
    onLogout,
    loadUsers,
    removeUser,
    setAddingBoard
}



export const AppHeader = connect(mapStateToProps, mapDispatchToProps)(_AppHeader)