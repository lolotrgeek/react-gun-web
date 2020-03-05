import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrin, faSmile, faMeh, faFrown, faDizzy } from "@fortawesome/free-solid-svg-icons";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';


const useStyles = makeStyles(theme => ({
    root: {
        width: 300 + theme.spacing(3) * 2,
    },
    margin: {
        height: theme.spacing(3),
    },
}));

function ValueLabelComponent(props) {
    const { children, open, value } = props;

    const popperRef = React.useRef(null);

    React.useEffect(() => {
        if (popperRef.current) {
            popperRef.current.update();
        }
    });

    return (
        <Tooltip
            PopperProps={{
                popperRef,
            }}
            open={open}
            enterTouchDelay={0}
            placement="top"
            title={value}
        >
            {children}
        </Tooltip>
    );
}
ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
};

const PrettoSlider = withStyles({
    root: {
        color: '#52af77',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

export function MoodPicker(props) {
    return (
        <Grid container direction='column' justify='center' alignItems='center'>
            <h3>{props.title ? props.title : 'Mood'}</h3>
            <Grid container direction='row' justify='center' alignItems='center'>
                <IconButton aria-label="great">
                    <FontAwesomeIcon
                        icon={faGrin}
                        color="orange"
                        size={40}
                        style={{
                            fontWeight: props.selected === 'great' ? 'bold' : 'normal',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: props.selected === 'great' ? 60 : 40
                        }}
                        onClick={props.onGreat}
                    />
                </IconButton>
                <IconButton aria-label="good">
                    <FontAwesomeIcon
                        icon={faSmile}
                        size={40}
                        color="green"
                        style={{
                            fontWeight: props.selected === 'good' ? 'bold' : 'normal',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: props.selected === 'good' ? 60 : 40
                        }}
                        onClick={props.onGood}
                    />
                </IconButton>
                <IconButton aria-label="meh">
                    <FontAwesomeIcon
                        icon={faMeh}
                        size={40}
                        color="purple"
                        style={{
                            fontWeight: props.selected === 'meh' ? 'bold' : 'normal',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: props.selected === 'meh' ? 60 : 40
                        }}
                        onClick={props.onMeh}
                    />
                </IconButton>
                <IconButton aria-label="bad">
                    <FontAwesomeIcon
                        icon={faFrown}
                        size={40}
                        color="blue"
                        style={{
                            fontWeight: props.selected === 'bad' ? 'bold' : 'normal',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: props.selected === 'bad' ? 60 : 40
                        }}
                        onClick={props.onSad}
                    />
                </IconButton>
                <IconButton aria-label="awful">
                    <FontAwesomeIcon
                        icon={faDizzy}
                        size={40}
                        color="grey"
                        style={{
                            fontWeight: props.selected === 'awful' ? 'bold' : 'normal',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: props.selected === 'awful' ? 60 : 40
                        }}
                        onClick={props.onAwful}
                    />
                </IconButton>
            </Grid>
        </Grid>
    );
}

export function EnergySlider(props) {
    const classes = useStyles();
    return (
        <Grid container direction='column' justify='center' alignItems='center'>
            <h3>{props.title ? props.title : 'Energy Level'}</h3>
            <PrettoSlider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={props.startingEnergy}
                onChangeCommitted={props.onEnergySet}
            />
        </Grid>
    )
}

export function TimerStartNotes(props) {
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
        >
            <textarea
                multiline={false}
                placeholder="Motivation"
                placeholderGridColor="#abbabb"
                value={props.mood}
                editable={true}
                onChangeGrid={props.onChangeGrid}
                onFocus={props.onFocus}
            />
        </Grid >
    );
}