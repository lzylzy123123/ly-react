import { Dispatch } from 'react';
import { Action } from 'shared/reactTypes';

export interface Update<State> {
	action: Action<State>;
}

export function createUpdate<State>(action: Action<State>): Update<State> {
	return {
		action
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
	updateQueue.shared.pending = update;
}

export function processUpdateQueue<State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memorizedState: State } {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memorizedState = action(baseState);
		} else {  
			result.memorizedState = action;
		}
	}
	return result;
}
