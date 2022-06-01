import React from "react";
import {
    Label, Input
} from "reactstrap";
import classes from "./ProjectForecast.module.scss";

const HorizontalField = (props) => {
    const {
        label, id, content, className, inputType
    } = props;
    return (
        <div className={`mb-4 justify-content-around d-flex flex-row ${className}`}>
            <Label xs={4} for={id} className={`${classes.label} p-0`}>{label}</Label>
            {inputType !== "textarea" && (
                <Input xs={8} type="text" id={id} defaultValue={content} disabled className="ml-2" />
            )}
            {inputType === "textarea" && (
                <Input xs={8} type="textarea" id={id} defaultValue={content} disabled className="ml-2"
                    style={{ overflow: 'hidden', height: '6rem' }} />
            )}

            {/* <Input xs={8} type="text" id={id} defaultValue={content} disabled className="ml-2" /> */}
        </div>
    );
};

export default HorizontalField;
