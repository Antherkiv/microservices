from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine('postgresql+psycopg2://postgres@localhost/db')
session = scoped_session(sessionmaker(bind=engine))

