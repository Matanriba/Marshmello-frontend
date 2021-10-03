import React from 'react'
import { AiOutlineStar } from 'react-icons/ai'
import { RiBarChartFill } from 'react-icons/ri'
import { HiDotsHorizontal } from 'react-icons/hi'
import { FaUserAlt } from 'react-icons/fa'
import { connect } from 'react-redux'
import { activityTxtMap } from '../../services/activity.service'

import { onUpdateBoard } from '../../store/board.actions.js'
import { loadUsers } from '../../store/user.actions.js'
import { MemberAvatar } from '../shared/member-avatar.jsx'
import { InviteMembers } from './invite-members.jsx'
import { DynamicPopover } from '../shared/dynamic-popover.jsx'
import { SideMenu } from '../side-menu/side-menu.jsx'
import { BoardEditMembers } from '../shared/popover-children/board-edit-members'

class _BoardHeader extends React.Component {

    state = {
        isInviteOpen: false,
        rect: null,
        element: null,
        boardTitle: this.props.board.title,
        isMenuOpen: false,
        numOfShownMembers: 7,
        isMembersOpen: false,
    }

    inviteRef = React.createRef()
    membersRef = React.createRef()

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
        this.props.loadUsers()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    handleResize = () => {
        const { numOfShownMembers } = this.state
        if (window.innerWidth < 800) {
            if (numOfShownMembers === 3) return
            this.setState({ numOfShownMembers: 3 })

        } else if (window.innerWidth > 800 && window.innerWidth < 1300) {
            if (numOfShownMembers === 7) return
            this.setState({ numOfShownMembers: 7 })

        } else {
            if (numOfShownMembers === 10) return
            this.setState({ numOfShownMembers: 10 })

        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.board.title !== this.props.board.title) {
            this.setState({ boardTitle: this.props.board.title })
        }
    }

    toggleStarredBoard = () => {
        const { board, onUpdateBoard } = this.props
        board.isStarred = !board.isStarred
        onUpdateBoard({ type: 'TOGGLE_STARRED', isStarred: board.isStarred }, board)
    }

    handleFocus = (event) => event.target.select();

    handleChange = ({ target: { name, value } }) => {
        this.setState((prevState) => ({ ...prevState, [name]: value }));
    }

    onChangeBoardTitle = () => {
        const { board, onUpdateBoard } = this.props
        board.title = this.state.boardTitle
        const activity = { txt: activityTxtMap.renameBoard(board.title) }
        onUpdateBoard({ type: 'CHANGE_TITLE', title: board.title }, board, activity)
    }

    toggleMenu = () => {
        this.setState((prevState) => ({ ...prevState, isMenuOpen: !this.state.isMenuOpen }))
    }

    getRemainingMembers = () => {
        const members = [...this.props.board.members]
        members.splice(this.state.numOfShownMembers)
        return members
    }

    getExtraMembersLength = () => (this.props.board.members.length - this.state.numOfShownMembers)

    onMembersClose = () => this.setState({ isMembersOpen: false })

    render() {
        const { board, onToggleDashboard } = this.props
        const { boardTitle, isMenuOpen, isInviteOpen, numOfShownMembers, isMembersOpen } = this.state
        const members = this.getRemainingMembers()
        const extraMembersLength = this.getExtraMembersLength()

        return (
            <section className="board-header">
                <div className="left-btns">
                    <button className="board-title nav-button">
                        <input className='clean-input' type='text' value={boardTitle} name='boardTitle' onFocus={this.handleFocus} onChange={this.handleChange} onBlur={this.onChangeBoardTitle} />
                    </button>
                    <button className={`starred-btn nav-button ${(board.isStarred) ? 'starred' : ''}`} onClick={() => this.toggleStarredBoard()}><AiOutlineStar /></button> |
                    <div className="members-container flex"><div className="user-previews">
                        {members.map((member, idx) =>
                            <MemberAvatar key={member._id} member={member} style={{ left: idx * -5 }} />
                        )}
                        {extraMembersLength > 0 && (
                            <div

                                ref={this.membersRef}
                            >
                                <div className="list-item-layover round" style={{ transform: `translateX(${(members.length) * -5}px)` }} onClick={() => this.setState({ isMembersOpen: !isMembersOpen })}></div>
                                <div
                                    className="show-more-btn"
                                    style={{ transform: `translateX(${(members.length) * -5}px)` }}
                                >
                                    {`+${extraMembersLength}`}
                                </div>
                                {isMembersOpen && <DynamicPopover onClose={() => this.setState({ isMembersOpen: false })} title="Members" ref={this.membersRef}>
                                    <BoardEditMembers members={board.members.filter(member => member._id)} onClose={this.onMembersClose} />
                                </DynamicPopover>}
                            </div>
                        )}
                    </div>
                        <div className='relative' ref={this.inviteRef}>
                            <button onClick={() => this.setState({ isInviteOpen: !isInviteOpen })} className="invite-btn nav-button">Invite</button>
                            {isInviteOpen && <DynamicPopover onClose={() => this.setState({ isInviteOpen: false })} title="Invite Members" ref={this.inviteRef}>
                                <InviteMembers />
                            </DynamicPopover>}
                        </div></div>
                </div>
                <div className="right-btns">
                    {!isMenuOpen && <>
                        <button className="nav-button members-btn"><FaUserAlt /></button>
                        <button className={`dashboard-btn nav-button ${(isMenuOpen) ? 'menu-open' : ''}`}><RiBarChartFill /> {window.innerWidth > 1100 && <span>Dashboard</span>}</button>
                        <button onClick={()=>onToggleDashboard(true)} className={`dashboard-btn nav-button ${(isMenuOpen) ? 'menu-open' : ''}`}><RiBarChartFill /> {window.innerWidth > 1100 && <span>Dashboard</span>}</button>
                        <button onClick={() => this.toggleMenu()} className="right-menu-btn nav-button"><HiDotsHorizontal /> {window.innerWidth > 1100 && <span>Show Menu</span>}</button>
                    </>}
                </div>
                <SideMenu isMenuOpen={isMenuOpen} onClose={() => { this.toggleMenu() }} />
            </section >
        )
    }
}

function mapStateToProps(state) {
    return {
        board: state.boardModule.currBoard,
        users: state.userModule.users,
    }
}
const mapDispatchToProps = {
    loadUsers,
    onUpdateBoard

}



export const BoardHeader = connect(mapStateToProps, mapDispatchToProps)(_BoardHeader)