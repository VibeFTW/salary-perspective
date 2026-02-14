# ============================================================
# Salary Perspective — Android Build Environment
# Builds the web app + Android AAB entirely inside Docker.
# No Node.js, JDK, or Android Studio needed on the host.
# ============================================================

FROM node:18-bookworm-slim

# ---- System packages & JDK 17 ----
RUN apt-get update && apt-get install -y --no-install-recommends \
        openjdk-17-jdk-headless \
        wget \
        unzip \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# ---- Android SDK command-line tools ----
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=$ANDROID_HOME
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

RUN mkdir -p $ANDROID_HOME/cmdline-tools \
    && wget -q "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" \
       -O /tmp/cmdline-tools.zip \
    && unzip -q /tmp/cmdline-tools.zip -d /tmp/cmdline-tools \
    && mv /tmp/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest \
    && rm /tmp/cmdline-tools.zip

# Accept all SDK licenses & install required components
RUN yes | sdkmanager --licenses > /dev/null 2>&1 && \
    sdkmanager \
        "platforms;android-34" \
        "build-tools;34.0.0" \
        "platform-tools"

# ---- Working directory ----
WORKDIR /app

# ---- Copy build scripts ----
COPY scripts/docker-entrypoint.sh  /docker-entrypoint.sh
COPY scripts/patch-build-gradle.js /patch-build-gradle.js
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
