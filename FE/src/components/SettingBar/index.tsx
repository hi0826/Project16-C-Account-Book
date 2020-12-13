import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAccountBookData } from '../../store/AccountBook/accountBookInfoHook';

import HeaderButton from '../Common/HeaderButton';
import SettingButtons from './SettingButtons';
import './settingBar.scss';

export default function SettingBar({ settingType, setSettingType }) {
  const history = useHistory();
  const accountBookId = useAccountBookData(store => store.accountBook._id);
  const onClickBackBtn = event => {
    history.push({
      pathname: event.target.dataset.type,
      state: {
        id: accountBookId,
      },
    });
  };

  return (
    <header className="settingbar__header">
      <div className="settingbar__buttons">
        <div
          data-type="/calendar"
          className="settingbar__back__navBtn checked"
          onClick={onClickBackBtn}
        >
          <i data-type="/calendar" className="fas fa-arrow-left" />
          <span className="nav__accountbook__btn" data-type="/calendar">
            Account Book
          </span>
        </div>
        <SettingButtons
          settingType={settingType}
          setSettingType={setSettingType}
        />
      </div>
    </header>
  );
}
