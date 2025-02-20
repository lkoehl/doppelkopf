import os
import sys
import logging

from flask import Flask  # type: ignore
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        # load config, if it exists, when not testing
        app.config.from_object(
            os.environ.get("APP_PROFILE", "doppelkopf.config.DevelopmentConfig")
        )
    else:
        # load the test config
        app.config.from_object("doppelkopf.config.TestingConfig")
        app.config.update(test_config)

    app.logger.addHandler(logging.StreamHandler(sys.stdout))
    app.logger.setLevel(logging.INFO)

    sentry_sdk.init(
        dsn="https://103f1e1585fc47efb1b56a24db8b9dcc@sentry.io/1449084",
        environment=app.config["ENV_NAME"],
        integrations=[FlaskIntegration(), SqlalchemyIntegration()],
    )

    from doppelkopf import admin, api

    app.register_blueprint(admin.blueprint)
    app.register_blueprint(api.blueprint)

    from doppelkopf import db

    db.init_app(app)

    return app
