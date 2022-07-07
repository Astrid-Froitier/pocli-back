import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import IEvent from '../interfaces/IEvent';

const getAllEvents = async (sortBy = ''): Promise<IEvent[]> => {
  let sql = 'SELECT * FROM events';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IEvent[]>(sql);
  return results[0];
};

const getEventById = async (idEvent: number): Promise<IEvent> => {
  const [results] = await connection
    .promise()
    .query<IEvent[]>('SELECT * FROM events WHERE id = ?', [idEvent]);
  return results[0];
};

const getEventByPostType = async (idPostType: number): Promise<IEvent[]> => {
  const results = await connection
    .promise()
    .query<IEvent[]>('SELECT * FROM events WHERE idPostType = ?', [idPostType]);
  return results[0];
};

const getEventByActivity = async (idActivity: number): Promise<IEvent[]> => {
    const results = await connection
      .promise()
      .query<IEvent[]>('SELECT * FROM events WHERE idActivity = ?', [idActivity]);
    return results[0];
  };

const addEvent = async (event: IEvent): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO events (numberParticipantsMax, date, description, text, podcastLink, reservedAdherent, price, idPostType, idActivity ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        event.numberParticipantsMax,
        event.date,
        event.description,
        event.text,
        event.podcastLink,
        event.reservedAdherent,
        event.price,
        event.idPostType,
        event.idActivity,
      ]
    );
  return results[0].insertId;
};

const updateEvent = async (
  idEvent: number,
  event: IEvent
): Promise<boolean> => {
  let sql = 'UPDATE events SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (event.numberParticipantsMax) {
    sql += 'numberParticipantsMax = ? ';
    sqlValues.push(event.numberParticipantsMax);
    oneValue = true;
  }
  if (event.date) {
    sql += oneValue ? ', date = ? ' : ' date = ? ';
    sqlValues.push(event.date);
    oneValue = true;
  }
  if (event.description) {
    sql += oneValue ? ', description = ? ' : ' description = ? ';
    sqlValues.push(event.description);
    oneValue = true;
  }
  if (event.text) {
    sql += oneValue ? ', text = ? ' : ' text = ? ';
    sqlValues.push(event.text);
    oneValue = true;
  }
  if (event.podcastLink) {
    sql += oneValue ? ', podcastLink = ? ' : ' podcastLink = ? ';
    sqlValues.push(event.podcastLink);
    oneValue = true;
  }
  if (event.reservedAdherent) {
    sql += oneValue ? ', reservedAdherent = ? ' : ' reservedAdherent = ? ';
    sqlValues.push(event.reservedAdherent);
    oneValue = true;
  }
  if (event.price) {
    sql += oneValue ? ', price = ? ' : ' price = ? ';
    sqlValues.push(event.price);
    oneValue = true;
  }
  if (event.idPostType) {
    sql += oneValue ? ', idPostType = ? ' : ' idPostType = ? ';
    sqlValues.push(event.idPostType);
    oneValue = true;
  }
  if (event.idActivity) {
    sql += oneValue ? ', idActivity = ? ' : ' idActivity = ? ';
    sqlValues.push(event.idActivity);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idEvent);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteEvent = async (idEvent: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM events WHERE id = ?', [idEvent]);
  return results[0].affectedRows === 1;
};

const deleteEventByPostType = async (idPostType: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM events WHERE idPostType = ?', [idPostType]);
  return results[0].affectedRows > 1;
};

const deleteEventByActivity = async (idActivity: number): Promise<boolean> => {
    const results = await connection
      .promise()
      .query<ResultSetHeader>('DELETE FROM events WHERE idActivity = ?', [idActivity]);
    return results[0].affectedRows > 1;
  };

export {
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getEventByPostType,
  getEventByActivity,
  deleteEventByPostType,
  deleteEventByActivity,
};
