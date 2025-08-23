package main

# Secrets should not be stored in ENV variables
secrets_env := [
  "passwd",
  "password",
  "pass",
  "secret",
  "key",
  "access",
  "api_key",
  "apikey",
  "token",
  "tkn",
]

deny contains msg if {
  input[i].Cmd == "env"
  some j
  val := lower(input[i].Value[j])
  secret := secrets_env[_]
  contains(val, secret)

  msg := sprintf("Line %d: Do not store secrets in ENV variables (%s)", [i, val])
}

# Base image rules
deny contains msg if {
  input[i].Cmd == "from"
  val := split(input[i].Value[0], "/")
  count(val) > 1

  msg := sprintf("Line %d: use a trusted base image", [i])
}

deny contains msg if {
  input[i].Cmd == "from"
  val := split(input[i].Value[0], ":")
  count(val) > 1
  lower(val[1]) == "latest"

  msg := sprintf("Line %d: do not use 'latest' tag for base images", [i])
}

# Avoid curl|wget pipe (curl bashing)
deny contains msg if {
  input[i].Cmd == "run"
  val := concat(" ", input[i].Value)
  regex.match("(curl|wget).*([|>])", lower(val))

  msg := sprintf("Line %d: Avoid curl bashing", [i])
}

# Do not upgrade system packages
warn contains msg if {
  input[i].Cmd == "run"
  val := concat(" ", input[i].Value)
  regex.match(".*(apk|yum|dnf|apt|pip).*(install|update|upgrade).*", lower(val))

  msg := sprintf("Line %d: Do not upgrade your system packages: %s", [i, val])
}

# ADD vs COPY
deny contains msg if {
  input[i].Cmd == "add"

  msg := sprintf("Line %d: Use COPY instead of ADD", [i])
}

# User rules
user_defined if {
  some i
  input[i].Cmd == "user"
}

deny contains msg if {
  not user_defined

  msg := "Do not run as root, use USER instead"
}

forbidden_users := ["root", "toor", "0"]

deny contains msg if {
  some i
  input[i].Cmd == "user"
  users := [name | some j; input[j].Cmd == "user"; name := input[j].Value[0]]
  lastuser := users[count(users)-1]
  forbidden := forbidden_users[_]
  lower(lastuser) == forbidden

  msg := sprintf("Line %d: Last USER directive (USER %s) is forbidden", [i, lastuser])
}

# No sudo
deny contains msg if {
  input[i].Cmd == "run"
  val := concat(" ", input[i].Value)
  contains(lower(val), "sudo")

  msg := sprintf("Line %d: Do not use 'sudo' command", [i])
}

# Multi-stage builds check
info contains msg if {
  input[i].Cmd == "copy"
  not contains(concat(" ", input[i].Flags), "--from=")

  msg := sprintf("Line %d: COPY without multi-stage --from= detected", [i])
}
