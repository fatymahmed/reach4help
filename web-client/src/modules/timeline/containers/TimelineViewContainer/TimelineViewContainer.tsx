import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingWrapper from 'src/components/LoadingWrapper/LoadingWrapper';
import { ProfileState } from 'src/ducks/profile/types';
import {
  observeNonOpenRequests,
  observeOpenRequests,
} from 'src/ducks/requests/actions';
import { RequestState } from 'src/ducks/requests/types';
import { OfferStatus } from 'src/models/offers';
import { Request, RequestStatus } from 'src/models/requests';
import { ApplicationPreference } from 'src/models/users';

import TimelineList from '../../components/TimelineList/TimelineList';
import TopPanel from '../../components/TopPanel/TopPanel';

// TODO remove mock
const today = new Date();
const mockPin = {
  username: 'PinUser',
  applicationPreference: ApplicationPreference.pin,
};

const mockCav = {
  username: 'CavUser',
  applicationPreference: ApplicationPreference.cav,
};

const mockRequest = {
  pin: mockPin,
  cav: null,
  status: RequestStatus.pending,
};

const mockOffer = {
  pin: mockPin,
  request: mockRequest,
  status: OfferStatus.pending,
};

const mockTimelineItems = [
  {
    action: 'CREATE_REQUEST',
    actor: mockPin,
    offer: null,
    request: mockRequest,
    createdAt: new Date(today).setDate(today.getDate() - 9),
  },
  {
    action: 'CANCEL_REQUEST',
    actor: mockPin,
    offer: null,
    request: mockRequest,
    createdAt: new Date(today).setDate(today.getDate() - 8),
  },
  {
    action: 'COMPLETE_REQUEST',
    actor: mockCav,
    offer: null,
    request: mockRequest,
    createdAt: new Date(today).setDate(today.getDate() - 7),
  },
  {
    action: 'REMOVE_REQUEST',
    actor: mockCav,
    offer: null,
    request: mockRequest,
    createdAt: new Date(today).setDate(today.getDate() - 6),
  },
  {
    action: 'CREATE_OFFER',
    actor: mockCav,
    request: mockRequest,
    offer: mockOffer,
    createdAt: new Date(today).setDate(today.getDate() - 5),
  },
  {
    action: 'ACCEPT_OFFER',
    actor: mockPin,
    request: { ...mockRequest, status: RequestStatus.ongoing },
    offer: { ...mockOffer, status: OfferStatus.accepted },
    createdAt: new Date(today).setDate(today.getDate() - 4),
  },
  {
    action: 'REJECT_OFFER',
    actor: mockPin,
    request: { ...mockRequest, status: RequestStatus.ongoing },
    offer: { ...mockOffer, status: OfferStatus.accepted },
    createdAt: new Date(today).setDate(today.getDate() - 3),
  },
  {
    action: 'RATE_PIN',
    actor: mockCav,
    request: { ...mockRequest, status: RequestStatus.ongoing },
    offer: { ...mockOffer, status: OfferStatus.accepted },
    createdAt: new Date(today).setDate(today.getDate() - 2),
  },
  {
    action: 'RATE_CAV',
    actor: mockPin,
    request: { ...mockRequest, status: RequestStatus.ongoing },
    offer: { ...mockOffer, status: OfferStatus.accepted },
    createdAt: new Date(today).setDate(today.getDate() - 1),
  },
];

const TimelineViewContainer: React.FC<TimelineViewContainerProps> = ({
  requestId,
}) => {
  const dispatch = useDispatch();

  const [request, setRequest] = useState<Request | undefined>(undefined);

  const profileState = useSelector(
    ({ profile }: { profile: ProfileState }) => profile,
  );

  const requestsState = useSelector(
    ({ requests }: { requests: RequestState }) => requests,
  );

  useEffect(() => {
    let requestTemp: Request | undefined = requestsState.openRequests.data
      ? requestsState.openRequests.data[requestId]
      : undefined;
    requestTemp =
      requestTemp ||
      (requestsState.ongoingRequests.data
        ? requestsState.ongoingRequests.data[requestId]
        : undefined);
    requestTemp =
      requestTemp ||
      (requestsState.completedRequests.data
        ? requestsState.completedRequests.data[requestId]
        : undefined);
    requestTemp =
      requestTemp ||
      (requestsState.cancelledRequests.data
        ? requestsState.cancelledRequests.data[requestId]
        : undefined);
    requestTemp =
      requestTemp ||
      (requestsState.removedRequests.data
        ? requestsState.removedRequests.data[requestId]
        : undefined);
    setRequest(requestTemp);
  }, [requestsState, requestId]);

  useEffect(() => {
    if (
      profileState.profile &&
      profileState.profile.applicationPreference &&
      profileState.userRef
    ) {
      const unsubscribeFromOpen = observeOpenRequests(dispatch, {
        userRef: profileState.userRef,
        userType: profileState.profile.applicationPreference,
      });

      const unsubscribeFromOngoing = observeNonOpenRequests(dispatch, {
        userRef: profileState.userRef,
        userType: profileState.profile.applicationPreference,
        requestStatus: RequestStatus.ongoing,
      });

      const unsubscribeFromCompleted = observeNonOpenRequests(dispatch, {
        userRef: profileState.userRef,
        userType: profileState.profile.applicationPreference,
        requestStatus: RequestStatus.completed,
      });

      const unsubscribeFromCancelled = observeNonOpenRequests(dispatch, {
        userRef: profileState.userRef,
        userType: profileState.profile.applicationPreference,
        requestStatus: RequestStatus.cancelled,
      });

      const unsubscribeFromRemoved = observeNonOpenRequests(dispatch, {
        userRef: profileState.userRef,
        userType: profileState.profile.applicationPreference,
        requestStatus: RequestStatus.removed,
      });

      return () => {
        unsubscribeFromOpen();
        unsubscribeFromOngoing();
        unsubscribeFromCompleted();
        unsubscribeFromCancelled();
        unsubscribeFromRemoved();
      };
    }
  }, [dispatch, profileState]);

  if (!(profileState.profile && request)) {
    return <LoadingWrapper />;
  }

  const mockRequestUser = {
    name: 'Jon Snow',
    rating: 4.5,
    likes: 52,
    distance: '5km',
    address: '509 Gorby Lane, Jackson, FL 32065',
    applicationPreference: 'pin',
  };

  /*
    TODO: 
      Once backend changes for profile snapshot is done, instead of user={mockRequestUser},
      The Top Panel must take the user details from the request itself
  */
  return (
    <>
      <TopPanel request={request} user={mockRequestUser} />;
      <TimelineList items={mockTimelineItems} currentUser={mockPin} />
      {/* <TimelineList items={mockTimelineItems} currentUser={mockCav} /> */}
    </>
  );
};

interface TimelineViewContainerProps {
  requestId: string;
}

export default TimelineViewContainer;