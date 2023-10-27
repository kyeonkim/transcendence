import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import FriendListPanel from './friend_list_panal';
import AlarmListPanal from './alarm_list_panal';

import Badge from '@mui/material/Badge';  
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import ThreePIcon from '@mui/icons-material/ThreeP';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [alarmCount, setAlarmCount] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const setAlarmCountHandler = (count: number) => {
    setAlarmCount(alarmCount + 1);
    console.log('it workeed!!!');
    //나중에 알람패널완성되면 이밴트갯수를 가져와서 세팅
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab icon={<GroupIcon/>} {...a11yProps(0)} />
          <Tab icon={<ForumIcon/>} {...a11yProps(1)} />
          <Tab icon={<ThreePIcon/>} {...a11yProps(2)} />
            <Tab icon={
            <Badge color="secondary" badgeContent={alarmCount}>
              <NotificationsRoundedIcon/>
            </Badge>
              } {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <FriendListPanel />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Channel list
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        User list
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3} >
        <AlarmListPanal alarmCountHandler={setAlarmCountHandler}/>
      </CustomTabPanel>
    </Box>
  );
}