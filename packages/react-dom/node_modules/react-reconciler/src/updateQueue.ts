/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'react';
import { Action } from 'shared/reactTypes';
import { Lane } from './fiberLanes';

export interface Update<State> {
	action: Action<State>;
	lane: Lane;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	next: Update<any> | null;
}

export function createUpdate<State>(
	action: Action<State>,
	lane: Lane
): Update<State> {
	return {
		action,
		lane,
		next: null
	};
}

export interface UpdateQueue<State> {
	shared: {
		pending: null | Update<State>;
	};
	dispatch: Dispatch<State> | null;
}

export function createUpdateQueue<State>(): UpdateQueue<State> {
	return {
		shared: {
			pending: null
		},
		dispatch: null
	} as UpdateQueue<State>;
}

export function enQueueUpdate<State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) {
	const pending = updateQueue.shared.pending;
	if (pending === null) {
		update.next = update;
	} else {
		update.next = pending.next;
		pending.next = update;
	}

	updateQueue.shared.pending = update;
}

export function processUpdateQueue<State>(
	baseState: State,
	pendingUpdate: Update<State> | null,
	renderLane: Lane
): { memorizedState: State } {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState
	};
	if (pendingUpdate !== null) {
		const first = pendingUpdate.next;
		let pending = pendingUpdate.next as Update<any>;
		do {
			const updateLane = pending.lane;
			if (updateLane === renderLane) {
				const action = pendingUpdate.action;
				if (action instanceof Function) {
					baseState = action(baseState);
				} else {
					baseState = action;
				}
			} else {
				if (__DEV__) {
					console.error('不应该进入updateLane !== renderLane这个逻辑');
				}
			}
			pending = pending?.next as Update<any>;
		} while (pending !== first);
	}
  result.memorizedState = baseState;
	return result;
}
