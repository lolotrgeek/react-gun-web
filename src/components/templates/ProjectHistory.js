import React from 'react'
import { projectValid } from '../../constants/Validators'

import Stateless from '../molecules/Stateless'
import { Title } from '../molecules/Title'
import { SubHeader } from '../atoms/Header'
import { UnEvenGrid } from '../atoms/Grid'
import Grid from '../atoms/Grid'
import { Card, CardContent, CardActions, CardTitle } from '../atoms/Card';


import Typography from '../atoms/Typography'
import { Button } from '../atoms/Button'
import { View, ScrollView } from 'react-native'
import { useStyles, theme } from '../../themes/DefaultTheme'


/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @todo consider adding project id to header for reference
 */
export default function ProjectHistory(props) {
  const classes = useStyles()
  return (
    <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexGrow: 1,

    }}>
      {projectValid(props.project) && props.edits && props.edits.length > 0 ?
        <SubHeader
          className={props.classes.space}
          title={`${props.project.name} History`}
          buttonClick={props.headerButtonAction}
          buttonText='Edit'
        /> : <Stateless />}

      <ScrollView >
        {props.edits.map(edit => {
          return (
            <View key={edit[2]} style={{
              flex: 1,
              ...classes.space,
              ...classes.card
            }}>
              <Card>
                <CardContent>
                  {edit.length === 3 ?
                    <Title color={edit.color} variant='h6' >
                      {edit.length === 3 ? edit.name : ''}
                    </Title>
                    : null}
                  <Typography>{props.displayStatus(edit)}</Typography>
                </CardContent>
                <CardActions>
                  {props.displayRestoreButton(edit) ?
                    <UnEvenGrid
                      values={[
                        <Typography>{props.displayStatusDate(edit)}</Typography>,
                        <Button variant="contained" color="primary" onPress={() => {
                          props.restoreButtonAction(edit)
                        }}>Restore</Button>
                      ]}
                    />
                    : <UnEvenGrid values={[<Typography>{props.displayStatusDate(edit)}</Typography>]} />}
                </CardActions>
              </Card>
            </View>
          )
        })}
      </ScrollView>
    </View >
  )
}