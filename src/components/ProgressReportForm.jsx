import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Dropzone from 'react-dropzone';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import _ from 'lodash';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import { PROGRESS_REPORT_STATUS_CHOICES, PROGRESS_REPORT_STATUS_BEHIND_AND_STUCK } from '../constants/Api';
import { isDeveloper, getUser, isProjectManager, isProjectOwner } from '../utils/auth';

momentLocalizer(moment);

export default class ProgressReportForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: null, accomplished: '', next_steps: '', obstacles: '', remarks: '',
            last_deadline_met: null, deadline_report: '', next_deadline: null, team_appraisal: '',
            attachments: [], task_start: null, next_deadline_meet: null, today_to_dos: '',
            this_week_deadline_met: null, pm_deadline_informed: null, deliverable_satisfaction: null,
            pm_communication: null, stuck_details: '', next_deadline_fail_reason:''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const progress_report = this.props.progress_report || {};
        if(progress_report.id) {
            this.setState({...progress_report});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.ProgressReport.detail.isSaved && !prevProps.ProgressReport.detail.isSaved) {
            if(!this.props.progress_report) {
                if(this.refs.progress_report_form) {
                    this.refs.progress_report_form.reset();
                }
                this.setState({
                    status: null, accomplished: '', next_steps: '', obstacles: '', remarks: '',
                    last_deadline_met: null, deadline_report: '', next_deadline: null, team_appraisal: '',
                    attachments: [], task_start: null, next_deadline_meet: null, today_to_dos: '',
                    this_week_deadline_met: null, pm_deadline_informed: null, deliverable_satisfaction: null,
                    pm_communication: null, stuck_details: '', next_deadline_fail_reason:''
                });
            }
        }
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onProgressStatusChange(status) {
        this.setState({status});
    }

    onLastDeadlineStatusChange(last_deadline_met) {
        this.setState({last_deadline_met});
    }

    onNextDeadlineChange(date) {
        this.setState({next_deadline: moment(date).utc().format()});
    }

    onDrop(attachments) {
        var current = this.state.attachments;
        this.setState({attachments: current.concat(attachments)});
    }

    onAddAttachment() {
        this.refs.dropzone.open();
    }

    onTaskStartChange(date) {
        this.setState({task_start: moment(date).utc().format()});
    }

    onNextDeadlineMeetChange(next_deadline_meet) {
        this.setState({next_deadline_meet});
    }

    onThisWeekDeadlineMetChange(this_week_deadline_met) {
        this.setState({this_week_deadline_met});
    }

    onPmDeadlineInformedChange(pm_deadline_informed) {
        this.setState({pm_deadline_informed});
    }

    onDeliverableSatisfactionChange(deliverable_satisfaction) {
        this.setState({deliverable_satisfaction});
    }

    onPmCommunicationChange(pm_communication) {
        this.setState({pm_communication});
    }

    onStateValueChange(key, value) {
        var new_state = {};
        new_state[key] = value;
        this.setState(new_state);
    }

    getRatingsMap(to) {
        return _.range(0,to).map(x => { return {id: x, name: x}});
    }


    handleSubmit(e) {
        e.preventDefault();
        var status = this.state.status;
        var percentage = this.refs.percentage?this.refs.percentage.value.trim():null;
        var accomplished = this.state.accomplished;
        var next_steps = this.state.next_steps;
        var obstacles = this.state.obstacles;
        var remarks = this.state.remarks;
        const attachments = this.state.attachments;
        var last_deadline_met = this.state.last_deadline_met;
        var deadline_report = this.state.deadline_report;
        var next_deadline = this.state.next_deadline;
        var team_appraisal = this.state.team_appraisal;
        var task_start = this.state.task_start;
        var next_deadline_meet = this.state.next_deadline_meet;
        var today_to_dos = this.state.today_to_dos;
        var this_week_deadline_met = this.state.this_week_deadline_met;
        var pm_deadline_informed = this.state.pm_deadline_informed;
        var deliverable_satisfaction = this.state.deliverable_satisfaction;
        var pm_communication = this.state.pm_communication;
        var stuck_details = this.state.stuck_details;
        var next_deadline_fail_reason = this.state.next_deadline_fail_reason;


        const { ProgressReportActions } = this.props;
        const progress_report = this.props.progress_report || {};
        const milestone = this.props.milestone || {};

        const progress_report_info = {
            event: milestone.id, status, percentage, accomplished, next_steps, obstacles, remarks,
            last_deadline_met, deadline_report, next_deadline, team_appraisal, task_start, next_deadline_meet,
            today_to_dos, this_week_deadline_met, pm_deadline_informed, deliverable_satisfaction,
            pm_communication, stuck_details, next_deadline_fail_reason
        };
        if(progress_report.id) {
            ProgressReportActions.updateProgressReport(progress_report.id, progress_report_info);
        } else {
            ProgressReportActions.createProgressReport(progress_report_info, attachments);
        }
        return;
    }

    render() {
        const { ProgressReport } = this.props;
        const progress_report = this.props.progress_report || {};

        if(ProgressReport.detail.isSaved) {
            return (
                <FormStatus loading={ProgressReport.detail.isSaving}
                            success={ProgressReport.detail.isSaved}
                            message={`${isProjectOwner()?'Weekly Survey':'Progress Report'} saved successfully`}
                            error={ProgressReport.detail.error.create || ProgressReport.detail.error.update}/>
            );
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit} name="progress_report" role="form" ref="progress_report_form">
                    <h4>{isProjectOwner()?'Weekly Survey':'Progress Report'}</h4>
                    <FormStatus loading={ProgressReport.detail.isSaving}
                                success={ProgressReport.detail.isSaved}
                                message={`${isProjectOwner()?'Weekly Survey':'Progress Report'} saved successfully`}
                                error={ProgressReport.detail.error.create || ProgressReport.detail.error.update}/>

                    {isDeveloper() || isProjectManager()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.status)?
                                (<FieldError message={ProgressReport.detail.error.create.status}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.status)?
                                (<FieldError message={ProgressReport.detail.error.update.status}/>):null}
                            <div className="form-group">
                                <label className="control-label">Task status *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="task ststus">
                                        {PROGRESS_REPORT_STATUS_CHOICES.map(status => {
                                            return (
                                            <button key={status.id} type="button"
                                                    className={"btn " + (this.state.status == status.id?' active':'')}
                                                    onClick={this.onProgressStatusChange.bind(this, status.id)}>{status.name}
                                            </button>
                                                )
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ):null}

                    {isDeveloper() && this.state.status == PROGRESS_REPORT_STATUS_BEHIND_AND_STUCK ?(
                        <div>
                            {/* check status if stuck and is developer for this */}

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.stuck_reason)?
                                (<FieldError message={ProgressReport.detail.error.create.stuck_reason}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.stuck_reason)?
                                (<FieldError message={ProgressReport.detail.error.update.stuck_reason}/>):null}
                            <div className="form-group">
                                <label className="control-label">Select reason why you are stuck</label>
                                <select className="form-control">
                                    <option value="1">Resolving an Error</option>
                                    <option value="2">Poor Documenatation</option>
                                    <option value="3">Hardware problem</option>
                                    <option value="4">Unclear specifications</option>
                                    <option value="5">Personal Circumstances</option>
                                    <option value="6">Other</option>
                                </select>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.stuck_details)?
                                (<FieldError message={ProgressReport.detail.error.create.stuck_details}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.stuck_details)?
                                (<FieldError message={ProgressReport.detail.error.update.stuck_details}/>):null}
                            <div className="form-group">
                                <label className="control-label">Explain Further why you are stuck/what should be done.</label>
                                <textarea placeholder="More details"
                                          className="form-control"
                                          ref="stuck_details"
                                          onChange={this.onInputChange.bind(this, 'stuck_details')}
                                          value={this.state.stuck_details}>{this.state.stuck_details}</textarea>
                            </div>
                        </div>
                    ):null}

                    {isDeveloper()?(
                        <div>
                            <div>
                                <div className="form-group">
                                    <label className="control-label">When did you start this sprint/task/project?</label>
                                    <DateTimePicker ref="started_at"
                                                    onChange={this.onTaskStartChange.bind(this)}
                                                    time={false}/>
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label className="control-label">When is the next deadline? *</label>
                                    <DateTimePicker ref="due_at"
                                                    onChange={this.onNextDeadlineChange.bind(this)}
                                                    time={false}/>
                                </div>
                            </div>

                            <div>
                                {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.next_deadline_meet)?
                                    (<FieldError message={ProgressReport.detail.error.create.next_deadline_meet}/>):null}
                                {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.next_deadline_meet)?
                                    (<FieldError message={ProgressReport.detail.error.update.next_deadline_meet}/>):null}
                                <div className="form-group">
                                    <label className="control-label">Do you anticipate to meet this deadline? *</label>
                                    <div>
                                        <div className="btn-group btn-choices select" role="group" aria-label="task deadline meet">
                                            {[
                                                {id: true, name: 'Yes'},
                                                {id: false, name: 'No'}
                                            ].map(status => {
                                                return (
                                                    <button key={status.id} type="button"
                                                            className={"btn " + (typeof this.state.next_deadline_meet == 'boolean' && this.state.next_deadline_meet == status.id?' active':'')}
                                                            onClick={this.onNextDeadlineMeetChange.bind(this, status.id)}>{status.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {typeof this.state.next_deadline_meet == 'boolean' && !this.state.next_deadline_meet?(
                                    <div>
                                        {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.next_deadline_fail_reason)?
                                            (<FieldError message={ProgressReport.detail.error.create.next_deadline_fail_reason}/>):null}
                                        {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.next_deadline_fail_reason)?
                                            (<FieldError message={ProgressReport.detail.error.update.next_deadline_fail_reason}/>):null}
                                        <div className="form-group">
                                            <label className="control-label">Why won't you be able to make the next deadline?</label>
                                    <textarea placeholder="Reasons why you won't be able to make the next deadline"
                                              className="form-control"
                                              ref="next_deadline_fail_reason"
                                              onChange={this.onInputChange.bind(this, 'next_deadline_fail_reason')}
                                              value={this.state.next_deadline_fail_reason}>{this.state.next_deadline_fail_reason}</textarea>
                                        </div>
                                    </div>
                                ):null}
                            </div>
                        </div>
                    ):null}

                    {isDeveloper()|| isProjectManager()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.percentage)?
                                (<FieldError message={ProgressReport.detail.error.create.percentage}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.percentage)?
                                (<FieldError message={ProgressReport.detail.error.update.percentage}/>):null}
                            <div className="form-group">
                                <label className="control-label">Percentage completed *</label>
                                <div>
                                    <input type="number" className="form-control" ref="percentage" required placeholder="Percentage completed" defaultValue={progress_report.percentage}/>
                                </div>
                            </div>

                        </div>
                    ):null}

                    {isProjectManager()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.last_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.create.last_deadline_met}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.last_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.update.last_deadline_met}/>):null}
                            <div className="form-group">
                                <label className="control-label">Was the last deadline met? *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="task ststus">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.last_deadline_met == 'boolean' && this.state.last_deadline_met == status.id?' active':'')}
                                                        onClick={this.onLastDeadlineStatusChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {typeof this.state.last_deadline_met == 'boolean' && !this.state.last_deadline_met?(
                                <div>
                                    {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.deadline_report)?
                                        (<FieldError message={ProgressReport.detail.error.create.deadline_report}/>):null}
                                    {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.deadline_report)?
                                        (<FieldError message={ProgressReport.detail.error.update.deadline_report}/>):null}
                                    <div className="form-group">
                                        <label className="control-label">Why wasn't the last deadline met? Please provide a detailed explanation. *</label>
                                    <textarea placeholder="Why wasn't the last deadline met? Please provide a detailed explanation."
                                              className="form-control"
                                              ref="deadline_report"
                                              onChange={this.onInputChange.bind(this, 'deadline_report')}
                                              value={this.state.deadline_report} required>{this.state.deadline_report}</textarea>
                                    </div>
                                </div>
                            ):null}
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.accomplished)?
                                (<FieldError message={ProgressReport.detail.error.create.accomplished}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.accomplished)?
                                (<FieldError message={ProgressReport.detail.error.update.accomplished}/>):null}
                            <div className="form-group">
                                <label className="control-label">What has been accomplished since the last update? *</label>
                                <textarea placeholder="What has been accomplished since the last update?"
                                          className="form-control"
                                          ref="accomplished"
                                          onChange={this.onInputChange.bind(this, 'accomplished')}
                                          value={this.state.accomplished} required>{this.state.accomplished}</textarea>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Files</label>
                                <div>
                                    <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} style={{display: 'none'}}>
                                        <div>Try dropping some files here, or click to select files to upload.</div>
                                    </Dropzone>
                                    {this.state.attachments?(
                                        <div>
                                            {this.state.attachments.map((file) => {
                                                return (<div><i className="fa fa-file-text-o"/> {file.name}</div>)
                                            })}
                                        </div>
                                    ):null}
                                    <button type="button" className="btn " style={{marginRight: '5px'}}
                                            onClick={this.onAddAttachment.bind(this)}>
                                        <i className="fa fa-upload"/> Upload files
                                    </button>
                                </div>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.next_steps)?
                                (<FieldError message={ProgressReport.detail.error.create.next_steps}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.next_steps)?
                                (<FieldError message={ProgressReport.detail.error.update.next_steps}/>):null}
                            <div className="form-group">
                                <label className="control-label">What are the next steps? *</label>
                                <textarea placeholder="What are the next steps?"
                                          className="form-control"
                                          ref="next_steps"
                                          onChange={this.onInputChange.bind(this, 'next_steps')}
                                          value={this.state.next_steps} required>{this.state.next_steps}</textarea>
                            </div>
                            <div className="form-group">
                                <label className="control-label">When is the next deadline? *</label>
                                <DateTimePicker ref="due_at"
                                                onChange={this.onNextDeadlineChange.bind(this)}
                                                defaultValue={this.state.next_deadline?(new Date(moment.utc(this.state.next_deadline).format())):null}
                                                time={false}/>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.team_appraisal)?
                                (<FieldError message={ProgressReport.detail.error.create.team_appraisal}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.team_appraisal)?
                                (<FieldError message={ProgressReport.detail.error.update.team_appraisal}/>):null}
                            <div className="form-group">
                                <label className="control-label">Are you satisfied with the performance of the developers on this project, please give details? *</label>
                            <textarea placeholder="Are you satisfied with the performance of the developers on this project, please give details?"
                                      className="form-control"
                                      ref="team_appraisal"
                                      onChange={this.onInputChange.bind(this, 'team_appraisal')}
                                      value={this.state.team_appraisal} required>{this.state.team_appraisal}</textarea>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.obstacles)?
                                (<FieldError message={ProgressReport.detail.error.create.obstacles}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.obstacles)?
                                (<FieldError message={ProgressReport.detail.error.update.obstacles}/>):null}
                            <div className="form-group">
                                <label className="control-label">What obstacles are impeding your progress? *</label>
                                <textarea placeholder="What obstacles are impeding your progress?"
                                          className="form-control"
                                          ref="obstacles"
                                          onChange={this.onInputChange.bind(this, 'obstacles')}
                                          value={this.state.obstacles} required>{this.state.obstacles}</textarea>
                            </div>
                        </div>
                    ):null}

                    {isDeveloper()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.today_to_dos)?
                                (<FieldError message={ProgressReport.detail.error.create.today_to_dos}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.today_to_dos)?
                                (<FieldError message={ProgressReport.detail.error.update.today_to_dos}/>):null}
                            <div className="form-group">
                                <label className="control-label">what do you intend to achieve/complete today? *</label>
                                <textarea placeholder="What are your to dos for today?"
                                          className="form-control"
                                          ref="today_to_dos"
                                          onChange={this.onInputChange.bind(this, 'today_to_dos')}
                                          value={this.state.today_to_dos} required>{this.state.today_to_dos}</textarea>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.deadline_deliverable_rate)?
                                    (<FieldError message={ProgressReport.detail.error.create.deadline_deliverable_rate}/>):null}
                                {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.deadline_deliverable_rate)?
                                    (<FieldError message={ProgressReport.detail.error.update.deadline_deliverable_rate}/>):null}
                                <div className="form-group">
                                    <label className="control-label">How do you rate your deliverable for today's deadline?*</label>
                                    <div>
                                        <div className="btn-group btn-choices select" role="group">
                                            {this.getRatingsMap(6).map(status => {
                                                return (
                                                    <button key={status.id} type="button"
                                                            className={"btn " + (this.state.deadline_deliverable_rate == status.id?' active':'')}
                                                            onClick={this.onStateValueChange.bind(this, 'deadline_deliverable_rate', status.id)}>{status.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                        </div>

                    ):null}

                    {isProjectOwner()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.this_week_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.create.this_week_deadline_met}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.this_week_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.update.this_week_deadline_met}/>):null}
                            <div className="form-group">
                                <label className="control-label">Was the deadline for this week met? *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="this week deadline met">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.this_week_deadline_met == 'boolean' && this.state.this_week_deadline_met == status.id?' active':'')}
                                                        onClick={this.onThisWeekDeadlineMetChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {typeof this.state.this_week_deadline_met == 'boolean' && !this.state.this_week_deadline_met?(
                                <div>
                                    {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.pm_deadline_informed)?
                                        (<FieldError message={ProgressReport.detail.error.create.pm_deadline_informed}/>):null}
                                    {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.pm_deadline_informed)?
                                        (<FieldError message={ProgressReport.detail.error.update.pm_deadline_informed}/>):null}
                                    <div className="form-group">
                                        <label className="control-label">Did the project manager/developer(s) inform you promptly about not making the deadline?  *</label>
                                        <div>
                                            <div className="btn-group btn-choices select" role="group" aria-label="PM deadline info">
                                                {[
                                                    {id: true, name: 'Yes'},
                                                    {id: false, name: 'No'}
                                                ].map(status => {
                                                    return (
                                                        <button key={status.id} type="button"
                                                                className={"btn " + (typeof this.state.pm_deadline_informed == 'boolean' && this.state.pm_deadline_informed == status.id?' active':'')}
                                                                onClick={this.onPmDeadlineInformedChange.bind(this, status.id)}>{status.name}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ):null}

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.deliverable_satisfaction)?
                                (<FieldError message={ProgressReport.detail.error.create.deliverable_satisfaction}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.deliverable_satisfaction)?
                                (<FieldError message={ProgressReport.detail.error.update.deliverable_satisfaction}/>):null}
                            <div className="form-group">
                                <label className="control-label">Are you satisfied with the deliverables?  *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="deliverable satisfaction">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.deliverable_satisfaction == 'boolean' && this.state.deliverable_satisfaction == status.id?' active':'')}
                                                        onClick={this.onDeliverableSatisfactionChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.rate_deliverables)?
                                (<FieldError message={ProgressReport.detail.error.create.rate_deliverables}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.rate_deliverables)?
                                (<FieldError message={ProgressReport.detail.error.update.rate_deliverables}/>):null}
                            <div className="form-group">
                                <label className="control-label">How would you rate the deliverables on a scale from 1 to 5? *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group">
                                        {this.getRatingsMap(6).map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.rate_deliverables == 'boolean' && this.state.rate_deliverables == status.id?' active':'')}
                                                        onClick={this.onStateValueChange.bind(this, 'rate_deliverables', status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.pm_communication)?
                                (<FieldError message={ProgressReport.detail.error.create.pm_communication}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.pm_communication)?
                                (<FieldError message={ProgressReport.detail.error.update.pm_communication}/>):null}
                            <div className="form-group">
                                <label className="control-label">Is the communication between you and the project manager/clients going well?   *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="PM communication">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.pm_communication == 'boolean' && this.state.pm_communication == status.id?' active':'')}
                                                        onClick={this.onPmCommunicationChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ):null}

                    {isDeveloper()|| isProjectOwner()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.remarks)?
                                (<FieldError message={ProgressReport.detail.error.create.remarks}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.remarks)?
                                (<FieldError message={ProgressReport.detail.error.update.remarks}/>):null}
                            <div className="form-group">
                                <label className="control-label">Any other remarks or questions</label>
                                <textarea placeholder="Any other remarks or questions"
                                          className="form-control"
                                          ref="remarks"
                                          onChange={this.onInputChange.bind(this, 'remarks')}
                                          value={this.state.remarks}>{this.state.remarks}</textarea>
                            </div>
                        </div>

                    ):null}



                    <div className="text-center">
                        <button type="submit" className="btn  " disabled={ProgressReport.detail.isSaving}>{progress_report.id?'Update Report':'Save Report'}</button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}
