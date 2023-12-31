import axios from "axios";
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {Switch} from "@blueprintjs/core";

import urlSwap from "../../utils/urlSwap";

import AceWrapper from "./AceWrapper";
import VariableEditorUI from "./VariableEditorUI";
import VisualizationEditorUI from "./VisualizationEditorUI";

import TextButtonGroup from "../fields/TextButtonGroup";
import TextInput from "../fields/TextInput";
import VisibleSelector from "../interface/VisibleSelector";
import Alert from "../interface/Alert";

import "./VariableEditor.css";

const preMessage = {
  generator: <Fragment>You have access to the variable <strong>resp</strong>, which represents the response to the above API call.</Fragment>,
  story_generator: <Fragment>You have access to the variable <strong>resp</strong>, which represents the response to the above API call.</Fragment>,
  materializer: <Fragment>You have access to all variables previously created by generators</Fragment>,
  story_materializer: <Fragment>You have access to all variables previously created by generators</Fragment>,
  visualization: <Fragment>You have access to all variables previously created by generators and materializers.</Fragment>,
  formatter: <Fragment>You have access to the variable <code>n</code>, which represents the string to be formatted.</Fragment>
};

const postMessage = {
  generator: <Fragment>Be sure to return an <strong>object</strong> with the variables you want stored as keys.</Fragment>,
  story_generator: <Fragment>Be sure to return an <strong>object</strong> with the variables you want stored as keys.</Fragment>,
  materalizer: <Fragment>Be sure to return an <strong>object</strong> with the variables you want stored as keys.</Fragment>,
  story_materalizer: <Fragment>Be sure to return an <strong>object</strong> with the variables you want stored as keys.</Fragment>,
  visualization: <Fragment>Be sure to return a valid config object for a visualization</Fragment>,
  formatter: <Fragment>Be sure to return a <strong>string</strong> that represents your formatted content.</Fragment>
};

class VariableEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      payload: null,
      simple: false,
      alertObj: false,
      isDirty: false,
      url: null
    };
  }

  componentDidMount() {
    const {data, type} = this.props;
    // If simple has been used in the past and this is a generator, we MUST fetch the payload from the
    // API so that the results for the variables can be filled in.
    if (type.includes("generator")) {
      const maybePreview = () => data.simple ? this.previewPayload(true) : null;
      this.setState({data}, maybePreview);
    }
    // If simple has been used in the past as a visualization, we need only switch to simple mode without payload.
    else if (type.includes("visualization")) {
      const {simple} = data;
      this.setState({data, simple});
    }
    else {
      this.setState({data});
    }
  }

  // handles changes in text, code editor, or visibility
  changeData(field, e) {
    const {isDirty, data} = this.state;

    let target = e; // target is already a string
    if (typeof e === "object" && e.target) target = e.target.value; // grab the value from the event
    data[field] = target; // set the field

    if (!isDirty) {
      if (this.props.markAsDirty) this.props.markAsDirty();
      this.setState({isDirty: true, data});
    }
    else {
      this.setState({data});
    }
  }

  /**
   * Called by the "Refetch Data" button. Make sure the user knows that a new fetch will change the payload.
   */
  maybePreviewPayload() {
    const {payload} = this.state;
    // Only prompt the user if there is already a payload (therefore they are overriding/changing it)
    if (payload && !payload.error) {
      const alertObj = {
        callback: this.previewPayload.bind(this),
        title: "Reloading API results may cause some objects to become undefined.",
        confirm: "Okay"
      };
      this.setState({alertObj});
    }
    // If there is no payload or it was an error, they are fetching for the first time, so just grab it.
    else {
      this.previewPayload.bind(this)();
    }
  }

  /**
   * Hits the API and sets the resulting payload in state. Note that this can be called either by pressing the Fetch Data
   * button OR when the user switches to simple mode. When pressing fetch data, we need only hit the API again. However,
   * if the user is switching to simple, then once the API returns, handle switching the UI to simple mode (forceEZ).
   */
  previewPayload(forceSimple) {
    const {data} = this.state;
    const {api} = data;
    const {attr, env} = this.props;
    const {previews, localeDefault} = this.props.status;
    // Stories can use VariableEditors, but don't have variables
    const variables = this.props.variables[localeDefault] || {};
    if (api) {
      // The API will have <ids> in it that needs to be replaced with the current preview.
      // Use urlSwap to swap ANY instances of variables between brackets (e.g. <varname>)
      // With its corresponding value. Same goes for locale
      const lookup = {locale: localeDefault};
      const thesePreviews = previews || [];
      thesePreviews.forEach((p, i) => {
        if (i === 0) {
          lookup.id = p.id;
        }
        lookup[`id${i + 1}`] = p.id;
      });
      const url = urlSwap(api, Object.assign({}, attr, env, variables, lookup));
      this.setState({url});
      axios.get(url).then(resp => {
        const payload = resp.data;
        let {simple} = this.state;
        // This comparison is important! forceSimple must be EXACTLY true to indicate we are overriding it. Otherwise it's a
        // proxy event from a click, which indeed is truthy, but not a pure argument override.
        if (forceSimple === true) {
          simple = true;
          data.simple = true;
        }
        this.setState({payload, simple, data, alertObj: false});
      }).catch(() => {
        const payload = {error: "Please enter a valid API URL."};
        let {simple} = this.state;
        // This comparison is important! forceSimple must be EXACTLY true to indicate we are overriding it. Otherwise it's a
        // proxy event from a click, which indeed is truthy, but not a pure argument override.
        if (forceSimple === true) {
          simple = true;
          data.simple = true;
        }
        this.setState({payload, simple, data, alertObj: false});
      });
    }
    else {
      const payload = {error: "Please enter a valid API URL."};
      let {simple} = this.state;
      // This comparison is important! forceSimple must be EXACTLY true to indicate we are overriding it. Otherwise it's a
      // proxy event from a click, which indeed is truthy, but not a pure argument override.
      if (forceSimple === true) {
        simple = true;
        data.simple = true;
      }
      this.setState({payload, simple, data, alertObj: false});
    }
  }

  maybeSwitchSimple() {
    const {simple} = this.state;
    let alertObj = false;
    if (simple) {
      alertObj = {
        callback: this.switchSimple.bind(this),
        title: "Note: Switching to JS mode will abandon your UI mode state.",
        confirm: "JS mode",
        theme: "caution"
      };
    }
    else {
      alertObj = {
        callback: this.switchSimple.bind(this),
        title: "Note: Switching to UI mode will abandon your current JS code.",
        confirm: "UI mode",
        theme: "caution"
      };
    }
    this.setState({alertObj});
  }

  switchSimple() {
    const {simple, data} = this.state;
    const {type} = this.props;
    if (simple) {
      data.simple = false;
      this.setState({simple: false, alertObj: false, data});
    }
    // If we are enabling simple mode
    else {
      // If it's a generator, then we need a payload before we can switch over.
      if (type.includes("generator")) {
        this.previewPayload.bind(this)(true);
      }
      // However it's a visualization, no payload is needed. Enable simple mode and switch without an API call.
      else if (type.includes("visualization")) {
        data.simple = true;
        this.setState({simple: true, data, alertObj: false});
      }
    }
  }

  onSimpleChange(code, simple) {
    const {isDirty, data} = this.state;
    data.logic = code;
    data.logic_simple = simple;
    if (!isDirty) {
      if (this.props.markAsDirty) this.props.markAsDirty();
      this.setState({isDirty: true, data});
    }
    else {
      this.setState({data});
    }
  }

  render() {
    const {data, payload, simple, alertObj, url} = this.state;
    const {type} = this.props;
    const {localeDefault} = this.props.status;

    // Stories can use VariableEditors, but don't have variables
    const variables = this.props.variables[localeDefault] || {};

    if (!data) return null;

    // add the UI mode toggle to footer
    let modeSwitcher = null;
    if (type.includes("generator") || type.includes("visualization")) {
      modeSwitcher =
        <Switch
          checked={simple}
          className={`cms-variable-editor-switcher u-font-xs cms-${type}-variable-editor-switcher`}
          label="UI mode"
          onChange={this.maybeSwitchSimple.bind(this)}
        />;
    }

    const magicVariables = variables && variables._genStatus && variables._genStatus.attributes ? variables._genStatus.attributes : {};

    return (
      <Fragment>
        <div className="cms-variable-editor" key="e">
          {/* name & description fields */}
          {(type.includes("generator") || type.includes("materializer") || type === "formatter") &&
            <div className="cms-field-group">
              <TextInput
                label="Name"
                namespace="cms"
                inline
                value={data.name}
                onChange={this.changeData.bind(this, "name")}
              />
              <TextInput
                label="Description"
                namespace="cms"
                inline
                value={data.description}
                onChange={this.changeData.bind(this, "description")}
              />
            </div>
          }

          {type.includes("generator") && <Fragment key="gf">
            <TextButtonGroup
              namespace="cms"
              inputProps={{
                label: "API",
                inline: true,
                namespace: "cms",
                value: data.api,
                onChange: this.changeData.bind(this, "api")
              }}
              buttonProps={{
                children: payload && !payload.error ? "Refetch data" : "Fetch data",
                namespace: "cms",
                icon: payload && !payload.error ? "refresh" : "download",
                onClick: this.maybePreviewPayload.bind(this)
              }}
            />
            {url &&
              <p className="cms-generator-variable-editor-url u-font-xxs u-margin-bottom-xs" key="u">
                Compiled URL: <a className="cms-generator-variable-editor-url-link" href={url}>{url}</a>
              </p>
            }
          </Fragment>}

          <div className={`cms-variable-editor-group u-margin-top-off ${simple ? "ui-mode" : "js-mode"}`}>

            {type.includes("generator") ? modeSwitcher : ""}

            {/* json */}
            {payload &&
              <div className="cms-variable-editor-inner" key="json">
                <h3 className="cms-variable-editor-heading u-font-xs">
                  Fetched data
                </h3>
                <pre className="cms-variable-editor-json">
                  <code className="cms-variable-editor-json-inner">{JSON.stringify(payload, null, 2)}</code>
                </pre>
              </div>
            }

            {simple
              ? type.includes("generator")
                ? payload
                  ? <VariableEditorUI
                    key="simp-gen"
                    payload={payload}
                    simpleConfig={data.logic_simple}
                    onSimpleChange={this.onSimpleChange.bind(this)}
                  />
                  : null
                : <VisualizationEditorUI
                  key="simp-viz"
                  simpleConfig={data.logic_simple}
                  onSimpleChange={this.onSimpleChange.bind(this)}
                  modeSwitcher={modeSwitcher}
                />
              : <div className="cms-variable-editor-js-outer">
                <h3 className={`cms-variable-editor-heading u-font-xs${ type === "visualization" ? " u-margin-top-off" : "" }`}>
                  Javascript
                </h3>
                <div className="cms-variable-editor-js">
                  <AceWrapper
                    key="ace-wrap"
                    className="editor"
                    ref={comp => this.editor = comp}
                    onChange={this.changeData.bind(this, "logic")}
                    value={data.logic}
                    {...this.props}
                  />
                </div>
              </div>
            }

            {type.includes("visualization") && !simple ? modeSwitcher : ""}
          </div>

          {/* callback instructions */}
          {!simple &&
            <section className="cms-variable-editor-help">
              <h3 className="u-font-xs">Callback</h3>
              <p className="u-font-xs">{preMessage[type]}</p>
              <p className="u-font-xs">{postMessage[type]}</p>
            </section>
          }

          {/* visibility */}
          {["generator", "materializer", "story_generator", "story_materializer", "visualization"].includes(type) &&
            <VisibleSelector
              type="generator"
              hideCustom={["generator", "materializer", "story_generator", "story_materializer"].includes(type)}
              variables={["generator", "story_generator"].includes(type) ? magicVariables : variables}
              value={data.allowed !== undefined ? data.allowed : "always"}
              onChange={this.changeData.bind(this, "allowed")}
            />
          }
        </div>

        <Alert
          title={alertObj.title}
          cancelButtonText="Cancel"
          confirmButtonText={alertObj.confirm}
          className="cms-confirm-alert"
          theme={alertObj.theme}
          isOpen={alertObj}
          onConfirm={alertObj.callback}
          onCancel={() => this.setState({alertObj: false})}
          key="a"
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  variables: state.cms.variables,
  env: state.env,
  status: state.cms.status
});

export default connect(mapStateToProps)(VariableEditor);
