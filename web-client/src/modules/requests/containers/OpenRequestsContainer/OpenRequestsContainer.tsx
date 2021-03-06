import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ProfileState } from 'src/ducks/profile/types';
import {
  getAcceptedRequests,
  getOpenRequests,
} from 'src/ducks/requests/actions';
import { RequestState } from 'src/ducks/requests/types';
import { ApplicationPreference } from 'src/models/users';
import { TimelineViewLocation } from 'src/modules/timeline/pages/routes/TimelineViewRoute/constants';

import Header from '../../components/Header/Header';
import RequestItem from '../../components/RequestItem/RequestItem';
import RequestList from '../../components/RequestList/RequestList';

const OpenRequestsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const profileState = useSelector(
    ({ profile }: { profile: ProfileState }) => profile,
  );

  const requestWithOffersAndTimeline = useSelector(
    ({ requests }: { requests: RequestState }) => {
      if (
        profileState.profile?.applicationPreference ===
        ApplicationPreference.cav
      ) {
        return requests.syncAcceptedRequestsState;
      }
      return requests.syncOpenRequestsState;
    },
  );

  useEffect(() => {
    if (profileState.profile && profileState.profile.applicationPreference) {
      if (
        profileState.profile.applicationPreference === ApplicationPreference.cav
      ) {
        dispatch(
          getAcceptedRequests({
            userType: profileState.profile.applicationPreference,
            userRef: profileState.userRef,
          }),
        );
      } else {
        dispatch(
          getOpenRequests({
            userType: profileState.profile.applicationPreference,
            userRef: profileState.userRef,
          }),
        );
      }
    }
  }, [profileState, dispatch]);

  const handleRequest: Function = id =>
    history.push(TimelineViewLocation.toUrl({ requestId: id }));

  const toCloseRequest: Function = id => `Fill logic: Remove request ${id}`;

  return (
    <>
      <Header
        requestsType="Open"
        numRequests={
          Object.keys(requestWithOffersAndTimeline.data || {}).length
        }
        isCav={
          profileState.profile?.applicationPreference ===
          ApplicationPreference.cav
        }
        isAcceptedRequests={false}
      />
      <RequestList
        requests={requestWithOffersAndTimeline.data}
        loading={
          requestWithOffersAndTimeline && requestWithOffersAndTimeline.loading
        }
        handleRequest={handleRequest}
        isCavAndOpenRequest={false}
        isPinAndOpenRequest={
          profileState.profile?.applicationPreference ===
          ApplicationPreference.pin
        }
        RequestItem={RequestItem}
        toCloseRequest={toCloseRequest}
      />
    </>
  );
};

OpenRequestsContainer.propTypes = {};

export default OpenRequestsContainer;
