class OyaGoError(Exception):
    """Base error for problems the API should report cleanly."""

    status_code = 500

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class ConfigurationError(OyaGoError):
    status_code = 500


class UpstreamError(OyaGoError):
    """The model or Backboard call failed."""

    status_code = 502
