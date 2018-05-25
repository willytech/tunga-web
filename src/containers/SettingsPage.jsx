import React from 'react';
import Progress from './../components/status/Progress';
import FormStatus from './../components/status/FormStatus';
import VisibilitySetting from './../components/VisibilitySetting';
import SwitchSetting from './../components/SwitchSetting';
import connect from '../utils/connectors/SettingsConnector';

import * as UserSettings from '../utils/UserSettings';
import {TASK_INVITATION_RESPONSE_EMAIL} from "../utils/UserSettings";

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {switches: null, visibility: null};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const {SettingsActions} = this.props;
        SettingsActions.retrieveSettings();
    }

    onVisibilitySettingChange(setting) {
        this.setState({visibility: {...this.state.visibility, ...setting}});
    }

    onSwitchSettingChange(setting) {
        this.setState({switches: {...this.state.switches, ...setting}});
    }

    handleSubmit(e) {
        e.preventDefault();
        var settings = {
            switches: this.state.switches,
            visibility: this.state.visibility,
        };

        const {SettingsActions} = this.props;

        SettingsActions.updateSettings(settings);
        return;
    }

    render() {
        const {Auth, Settings} = this.props;
        const {settings} = Settings;

        let promotional_email_switches = [
            UserSettings.NEWSLETTER_EMAIL, UserSettings.EVENT_EMAIL
            ],
            transactional_switches = [];

        if (Auth.user.is_developer) {
            transactional_switches = transactional_switches.concat([
                UserSettings.TASK_PROGRESS_REPORT_REMINDER_EMAIL,
                UserSettings.TASK_INVITATION_RESPONSE_EMAIL,
            ]);
        } else if(Auth.user.is_project_manager) {
            transactional_switches = transactional_switches.concat([
                UserSettings.TASK_PROGRESS_REPORT_REMINDER_EMAIL,
                UserSettings.TASK_INVITATION_RESPONSE_EMAIL,
            ]);
        } else {
            transactional_switches = transactional_switches.concat([
                UserSettings.TASK_SURVEY_REMINDER_EMAIL,
                UserSettings.NEW_TASK_PROGRESS_REPORT_EMAIL
            ]);
        }

        return (
            <div className="form-wrapper settings">
                <h2>Privacy Preferences</h2>
                {Settings.isRetrieving ? (
                    <Progress />
                ) : (
                    <div>
                        <div>
                            <FormStatus
                                loading={Settings.isSaving}
                                success={Settings.isSaved}
                                message={'Settings updated successfully'}
                                error={
                                    Settings.error.update ||
                                    Settings.error.update
                                }
                            />

                            {/*Auth.user.is_developer ? null : (
                                <div>
                                    <h4 className="title">Privacy settings</h4>
                                    {UserSettings.VISIBILITY_SETTINGS.map(
                                        setting => {
                                            return (
                                                <div
                                                    key={setting.name}
                                                    className="form-group row">
                                                    <div className="col-md-3">
                                                        {setting.label}
                                                    </div>
                                                    <div className="col-md-9">
                                                        <VisibilitySetting
                                                            name={setting.name}
                                                            visibility={
                                                                settings
                                                                    .visibility[
                                                                    setting.name
                                                                ]
                                                            }
                                                            onChange={this.onVisibilitySettingChange.bind(
                                                                this,
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            )*/}

                            <h4 className="title">Promotional Email Settings</h4>
                            {UserSettings.SWITCH_SETTINGS.map(setting => {
                                if (promotional_email_switches.indexOf(setting.name) === -1) {
                                    return null;
                                }
                                return (
                                    <div
                                        key={setting.name}
                                        className="form-group row">
                                        <div className="col-md-7">
                                            {setting.label}
                                        </div>
                                        <div className="col-md-5">
                                            <SwitchSetting
                                                name={setting.name}
                                                status={
                                                    settings.switches[
                                                        setting.name
                                                        ]
                                                }
                                                buttons={setting.buttons}
                                                onChange={this.onSwitchSettingChange.bind(
                                                    this,
                                                )}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <h4 className="title">Transactional Email Settings</h4>
                            {UserSettings.SWITCH_SETTINGS.map(setting => {
                                if (transactional_switches.indexOf(setting.name) === -1) {
                                    return null;
                                }
                                return (
                                    <div
                                        key={setting.name}
                                        className="form-group row">
                                        <div className="col-md-7">
                                            {setting.label}
                                        </div>
                                        <div className="col-md-5">
                                            <SwitchSetting
                                                name={setting.name}
                                                status={
                                                    settings.switches[
                                                        setting.name
                                                    ]
                                                }
                                                buttons={setting.buttons}
                                                onChange={this.onSwitchSettingChange.bind(
                                                    this,
                                                )}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <button
                                type="button"
                                className="btn "
                                disabled={Settings.isSaving}
                                onClick={this.handleSubmit}>
                                Save Changes
                            </button>
                            <div className="clearfix" />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(Settings);
