import React from 'react';
import { Tooltip } from 'reactstrap';

export default function TuteTooltip(props) {
    const {
        placement,
        isOpen,
        target,
        toggle,
        content,
        ...rest
    } = props;

    return (
        <Tooltip
            trigger="manual"
            className="af-tooltip"
            autohide={false}

            placement={placement}
            isOpen={isOpen}
            target={target}
            toggle={toggle}
            {...rest}
        >
            {content}
        </Tooltip>
    );
} 